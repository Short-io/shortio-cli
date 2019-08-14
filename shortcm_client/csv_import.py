import requests
import re
import argparse
import csv
import progressbar
import time
import arrow

subcommand = 'csv-import'

def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

FIELD_MAPPING={
    'originalURL': 'original_url_column',
    'createdAt': 'created_at_column',
    'title': 'title_column',
    'utmSource': 'utm_source_column',
    'utmMedium': 'utm_medium_column',
    'utmCampaign': 'utm_campaign_column',
}

def import_csv(filename, secret_key, domain, path_column, cloaking, delimiter, **kwargs):
    with open(filename) as f:
        csv_reader = csv.reader(f, delimiter=delimiter)
        lines = [line for line in csv_reader]
        links_count = len(lines)
        link_chunks = chunks(lines, 1000)
        pb = progressbar.ProgressBar(widgets=[
            progressbar.Percentage(),
            ' ',
            progressbar.Counter(),
            progressbar.Bar(),
            progressbar.AdaptiveETA()
        ], max_value=links_count)
        for idx, chunk in enumerate(link_chunks):
            link_dicts = []
            for chunk_item in chunk:
                link_dict = dict(
                    cloaking=int(cloaking),
                    path=re.sub('https?://[^/]+/', '', chunk_item[path_column]) if path_column is not None else None,
                )
                for api_param, cli_param in FIELD_MAPPING.items():
                    if kwargs.get(cli_param, None) is not None:
                        link_dict[api_param] = chunk_item[kwargs[cli_param]]
                        if api_param == "createdAt":
                            link_dict[api_param] = arrow.get(link_dict[api_param]).format()
                link_dicts.append(link_dict)
            r = requests.post('https://api.short.cm/links/bulk', headers={
                'Authorization': secret_key,
            }, json=dict(
                domain=domain,
                allowDuplicates=kwargs['allow_duplicates'],
                links=link_dicts,
            ))
            if r.status_code == 400:
                print(r.json())
                r.raise_for_status()
            r.raise_for_status()
            j = r.json()
            for link_status in j:
                if link_status.get('error'):
                    print(link_status['error'])
            pb.update(idx * 1000)
            time.sleep(1)


def add_parser(subparsers):
    import_parser = subparsers.add_parser('csv-import', help='CSV to Short.cm importer')
    import_parser.add_argument('--filename', dest='filename', help='Filename to import', required=True)
    import_parser.add_argument('--domain', dest='domain', help='Short domain', required=True)
    import_parser.add_argument('--cloaking', default=0, type=int, dest='cloaking', help='Cloaking enabled, default - disabled')
    import_parser.add_argument('--delimiter', default=',', dest='delimiter', help='CSV delimiter, by default – ,')
    import_parser.add_argument('--allow-duplicates', default=0, type=int, dest='allow_duplicates', help='Allow original URL dupilcates')
    import_parser.add_argument('--path-column', dest='path_column', help='Column number (starting from 0) for path', type=int)
    import_parser.add_argument('--original-url-column', dest='original_url_column', help='Column number (starting from 0) for original URL', required=True, type=int)
    import_parser.add_argument('--title-column', dest='title_column', help='Column number (starting from 0) for link title', type=int)
    import_parser.add_argument('--created-at-column', dest='created_at_column', help='Column number (starting from 0) for link creation date', type=int)
    import_parser.add_argument(
        '--utm-source-column', dest='utm_source_column', help='Column number (starting from 0) for link utm source', type=int)
    import_parser.add_argument(
        '--utm-medium-column', dest='utm_medium_column', help='Column number (starting from 0) for link utm medium', type=int)
    import_parser.add_argument(
        '--utm-campaign-column', dest='utm_campaign_column', help='Column number (starting from 0) for link utm medium', type=int)
    return import_parser


def run_command(args):
    import_csv(**vars(args))


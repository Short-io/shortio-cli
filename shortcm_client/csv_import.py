import itertools
import requests
import re
import argparse
import csv
import progressbar
import time
import arrow
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

subcommand = 'csv-import'

def chunks(l, n, link_count):
    """Yield successive n-sized chunks from l."""
    for i in range(0, link_count, n):
        yield itertools.islice(l, n)

FIELD_MAPPING={
    'originalURL': 'original_url_column',
    'createdAt': 'created_at_column',
    'title': 'title_column',
    'utmSource': 'utm_source_column',
    'utmMedium': 'utm_medium_column',
    'utmCampaign': 'utm_campaign_column',
}

def import_csv(filename, secret_key, domain, path_column, cloaking, delimiter, skip_lines, **kwargs):
    s = requests.Session()
    retry = Retry(
        total=5,
        status_forcelist=[502],
        method_whitelist=frozenset(['HEAD', 'TRACE', 'GET', 'PUT', 'OPTIONS', 'DELETE', 'POST']),
    )
    s.mount('https://', HTTPAdapter(max_retries=retry))
    with open(filename) as f:
        links_count = sum(1 for line in f) - skip_lines
    total_lines = skip_lines + links_count
    print(f"Skipping {skip_lines}, importing {links_count}. Total: {total_lines}")
    with open(filename) as f:
        csv_reader = csv.reader(f, delimiter=delimiter)
        itertools.islice(csv_reader, skip_lines)
        link_chunks = chunks(csv_reader, 1000, links_count)
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
            r = s.post('https://api.short.cm/links/bulk', headers={
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
    import_parser.add_argument('--skip-lines', dest='skip_lines', help='Skip first N lines from CSV before processing', type=int, default=0)
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


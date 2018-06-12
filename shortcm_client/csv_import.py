import requests
import re
import argparse
import csv

subcommand = 'csv-import'

def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

def import_csv(filename, secret_key, domain, original_url_column, path_column, title_column, created_at_column):
    with open(filename) as f:
        csv_reader = csv.reader(f)
        lines = [line for line in csv_reader]
        link_chunks = chunks(lines, 1000)
        for idx, chunk in enumerate(link_chunks):
            r = requests.post('https://api.short.cm/links/bulk', headers={
                'Authorization': secret_key,
            }, json=dict(
                domain=domain,
                links=[
                    dict(
                        originalURL=chunk_item[original_url_column],
                        path=re.sub('https?://[^/]+/', '', chunk_item[path_column]) if path_column is not None else None,
                        title=chunk_item[title_column] if title_column is not None else None,
                        createdAt=chunk_item[created_at_column] if created_at_column is not None else None,
                    ) for chunk_item in chunk
                ]
            ))
            r.raise_for_status()
            print(idx)


def add_parser(subparsers):
    import_parser = subparsers.add_parser('csv-import', help='CSV to Short.cm importer')
    import_parser.add_argument('--filename', dest='filename', help='Filename to import', required=True)
    import_parser.add_argument('--domain', dest='domain', help='Short domain', required=True)
    import_parser.add_argument('--path-column', dest='path_column', help='Column number (starting from 0) for path', required=True, type=int)
    import_parser.add_argument('--original-url-column', dest='original_url_column', help='Column number (starting from 0) for original URL', required=True, type=int)
    import_parser.add_argument('--title-column', dest='title_column', help='Column number (starting from 0) for link title', type=int)
    import_parser.add_argument('--created-at-column', dest='created_at_column', help='Column number (starting from 0) for link creation date', type=int)
    return import_parser


def run_command(args):
    import_csv(filename=args.filename, secret_key=args.secret_key, domain=args.domain,
               original_url_column=args.original_url_column, path_column=args.path_column, title_column=args.title_column,
               created_at_column=args.created_at_column)


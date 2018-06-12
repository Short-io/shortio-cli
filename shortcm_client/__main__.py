import requests
import re
import argparse
import csv
from . import csv_import, bitly_import, link_expand

shortcm_subparsers = [csv_import, bitly_import, link_expand]

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


def main():
    parser = argparse.ArgumentParser(description='CSV to Short.cm importer', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--secret-key', dest='secret_key', help='Your short.cm secret key', required=True)
    subparsers = parser.add_subparsers(dest="subcommand")
    subparsers.required = True
    for shortcm_subparser in shortcm_subparsers:
        shortcm_subparser.add_parser(subparsers)

    args = parser.parse_args()

    for shortcm_subparser in shortcm_subparsers:
        if args.subcommand == shortcm_subparser.subcommand:
            shortcm_subparser.run_command(args)

if __name__ == '__main__':
    main()

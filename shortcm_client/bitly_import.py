import requests
import re
import argparse
import logging

logging.basicConfig(level=logging.INFO)

subcommand = 'bitly-import'

def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

def import_bitly(bitly_key, secret_key, domain):
    bitly_session = requests.Session()
    bitly_session.headers={
        "Authorization": 'Bearer ' + bitly_key,
    }
    groups_res = bitly_session.get(
        'https://api-ssl.Bitly.com/v4/groups')
    groups_res.raise_for_status()
    groups = groups_res.json()
    print(groups)
    for group in groups['groups']:
        logging.info("Importing {name}".format(**group))
        bitlinks_res = bitly_session.get('https://api-ssl.Bitly.com/v4/groups/{guid}/bitlinks'.format(**group), params=dict(custom_bitlink="on"))
        bitlinks_res.raise_for_status()
        print(bitlinks_res.json())


def add_parser(subparsers):
    bitly_parser = subparsers.add_parser('bitly-import', help='CSV to Short.cm importer')
    bitly_parser.add_argument('--bitly-key', dest='bitly_key', help='Bitly API key', required=True)
    bitly_parser.add_argument('--domain', dest='domain', help='Short domain', required=False)
    return bitly_parser


def run_command(args):
    import_bitly(bitly_key=args.bitly_key, secret_key=args.secret_key, domain=args.domain)


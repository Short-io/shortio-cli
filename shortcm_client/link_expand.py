import requests
import re
import argparse
import sys
import csv
import progressbar

subcommand = 'link-expand'

def link_expand(domain, path, secret_key):
    r = requests.get('https://api.short.cm/links/expand', headers={
        'Authorization': secret_key,
    }, params=dict(
        domain=domain,
        path=path
    ))
    if r.status_code == 404:
        print("Path %s not found" % path)
        return
    r.raise_for_status()
    print(r.json())


def add_parser(subparsers):
    import_parser = subparsers.add_parser('link-expand', help='Get information about link by domain and path')
    import_parser.add_argument('--domain', dest='domain', help='Short domain', required=True)
    import_parser.add_argument('--path', dest='path', help='Path part of URL', required=True)
    return import_parser


def run_command(args):
    link_expand(args.domain, args.path, args.secret_key)


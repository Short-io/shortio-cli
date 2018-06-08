Short.cm CLI
===========================

A command line UI to [Short.cm website](https://short.cm).

First version only allows to import any CSV files (including YOURLS and Bitly) to Short.cm website.

You can get your secret key in [Connected apps & API](https://app.short.cm/users/connected_apps) page.


Usage:

    usage: cmd.py [-h] --secret-key SECRET_KEY {csv-import} ...

    CSV to Short.cm importer

    positional arguments:
      {csv-import}
        csv-import          CSV to Short.cm importer

    optional arguments:
      -h, --help            show this help message and exit
      --secret-key SECRET_KEY
                            Your short.cm secret key

CSV Import:

    usage: cmd.py csv-import [-h] --filename FILENAME --domain DOMAIN
                             --path-column PATH_COLUMN --original-url-column
                             ORIGINAL_URL_COLUMN [--title-column TITLE_COLUMN]
                             [--created-at-column CREATED_AT_COLUMN]

    optional arguments:
      -h, --help            show this help message and exit
      --filename FILENAME   Filename to import
      --domain DOMAIN       Short domain
      --path-column PATH_COLUMN
                            Column number (starting from 0) for path
      --original-url-column ORIGINAL_URL_COLUMN
                            Column number (starting from 0) for original URL
      --title-column TITLE_COLUMN
                            Column number (starting from 0) for link title
      --created-at-column CREATED_AT_COLUMN
                            Column number (starting from 0) for link creation date

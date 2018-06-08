Import CSV file to short.cm
===========================

Usage:

    usage: csv_import.py [-h] --secret-key SECRET_KEY --filename FILENAME --domain
                         DOMAIN --path-column PATH_COLUMN --original-url-column
                         ORIGINAL_URL_COLUMN [--title-column TITLE_COLUMN]
                         [--created-at-column CREATED_AT_COLUMN]

    CSV to Short.cm importer

    optional arguments:
      -h, --help            show this help message and exit
      --secret-key SECRET_KEY
                            Your short.cm secret key
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

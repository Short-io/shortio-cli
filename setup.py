#!/usr/bin/env python

from setuptools import setup

setup(name='shortcm-client',
      version='0.4',
      description='Short.cm commpand line UI',
      author='Andrii Kostenko',
      author_email='andrii@short.cm',
      url='https://github.com/Short-cm/shortcm-cli',
      packages=['shortcm_client'],
      long_description_content_type="text/markdown",
      long_description=open('README.md').read(),
      requires=['requests'],
      entry_points={
        'console_scripts': [
            'shortcm=shortcm_client.__main__:main',
        ]
      }
 )

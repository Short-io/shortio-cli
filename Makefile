upload:
	rm -rf dist
	pipenv run python setup.py sdist bdist_wheel
	pipenv run twine upload dist/*

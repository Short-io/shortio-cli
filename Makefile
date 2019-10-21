upload:
	rm -rf dist || true
	python3 setup.py sdist
	twine upload dist/*

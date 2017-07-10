import setuptools

setuptools.setup(
    name="nbnumbermd",
    version='0.1.0',
    author="Jacky Lu",
    description="",
    packages= ["nbnumbermd"],
    install_requires=[
        'notebook',
    ],
    package_data={'nbnumbermd': ['static/*']},
)

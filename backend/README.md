# *Timewise Backend*
___

## *How to Run*
First, in the terminal, cd into the src directory, then run the following 
command (you'll only have to do this once per project per terminal):
- `$env:PYTHONPATH = "."` for Windows, or
- `export PYTHONPATH="."` for Mac.

If you want to run a file that we created, and it's under the src 
directory, then write your run command in a similar fashion to how you would try
to cd into the file from the src directory. For example, let's say you have a 
file called `test.py` that has the following file tree representation:  

src/  
│── create/  
│   ├── lib/  
│   │   ├── test.py  

To run the file, cd into the src directory and then run the following command:
- `python -m create.lib.test {any program arguments here}`

Note: it is imperative that you use the `-m` flag as we are structuring our
files as Python modules.
___

## *File Structure*
- Every directory under and including src __MUST__ contain an (empty) 
`__init__.py` file. That is because we are structuring our code using Python 
modules.
- Directory and code file names should follow Python's PEP 8 rules where every 
character is lowercase and underscores separate words. No spaces allowed!
___

## *Import Statements*
If you are importing from another file that we created, and it's under the src 
directory, then write your import statement  in a similar fashion to how you 
would try to cd into the file from the src directory. For example, let's say you
have a file called `test.py` that has the following file tree representation:  

src/  
│── create/  
│   ├── lib/  
│   │   ├── test.py  

To import test.py from __ANY__ location under the src directory you would use 
the following import statement:
- `import create.lib.test`

Or, if you want to import a specific function/class from `test.py`:
- `from create.lib.test import {function/class name}`
___

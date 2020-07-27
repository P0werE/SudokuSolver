# Sudoku Solver
##### My attempt to write a sudoku solver in js

## How To
Download and and keep files in same directory
Open "index.html" - file and enjoy  
While coding this I used Chrome, I can not vouch for the functionality if you choose to use other browsers

## What Can You Do
- You can select panels and enter the wanted value.
- You can navigate through the table via Arrow Keys (Array wraps around)
- You can log the field via the button.  This will result in a array representation of the game field which is being printed onto the console
- You can load pre existing grids  
  ** Use the same dimension for this to work **

- or You can just solve an empty one


## Known Issues
I still studying the O-Notations therefor the performance is shit  

If you just creating a simple sudoku with empty values:  
My setup had no problems of solving the following grid sizes
> n =  {1, 2, 3, 4}

Havent Checked if other grid sizes will resolve a given sudoku but it should


The Interval functionality only works for "solvable" without using brute force

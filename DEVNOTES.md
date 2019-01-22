# Dev Notes
Lessons learned (plans, successes, mistakes, improvements)

## Project Log

1/22/19
* Create dev notes, project analysis
* Create d3.js POC with a horizontal bar chart. Horizontal chosen because most labels are very long
* Realized that the requirements say that the diagram is only +10 points. Let's focus instead on using sortable, filterable tables.
  * Looking at: [Tabulator](http://tabulator.info/examples/4.1?#filter-header) and [DataTables](https://datatables.net/extensions/fixedheader/examples/options/columnFiltering.html)
* Want to base design on: [Dashboard Theme](https://bootstrap-themes.github.io/dashboard/index.html)
* Started creating some POCs for DataTables. Definitely the best bet so far. Got responsive table and filterable table working. Now need to combine them.

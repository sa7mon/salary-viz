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
* Found some good template examples from the bootstrap website so I edited the HTML and took screenshots. Stuck them into the design folder.
* Started a GitHub Project in the repo to track issues. Broke them apart into 3 one-week sprints with cleaning at the end of each sprint
* Changed the way the script is laid out so that it can be properly called only on pages that need it.
* Feather Icons used JS to replace icons and caused a flash when loading the page. Didn't like. Moved to using IcoMoon generated SVG's which load instantly now.
* Updating the same template on multiple pages is now starting to get annoying. Should probably look at using Jeykyll / Hugo for static site generation.
* Before I'm done, I'd like to reduce the number of CDN calls I'm making for libs. Either download them locally or use npm to pull in and then gulp to concat + minify

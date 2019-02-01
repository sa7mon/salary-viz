# Dev Notes

## Lessons Learned
* Making the chart took longer than expected
* Should really have used a static site generator, just didn't want to take the time to learn a templating language
* Took too much time initally trying to perfect initial design idea when I ended up scrapping some of it anyway. Should have focused on getting the functionality down first. Downside to an iterative approach.
* StackOverflow is a great resource for posting exact, detailed questions (code fixed in ~ 30 mins)


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

1/23/19
* Put off moving to a static site generator for now
* Implemented Gulp and moved everyting to a src-dist organization. Made rules to concat, babel, and minify my app JS. Still need to get the libs downloaded (maybe with npm) 
* Created a package.json file to keep track of the dev dependencies
* Switched from generating the table in HTML and pointing DataTables at it to passing DataTables the data and having it generate the table. This way it will have greater control over how to format and render the data.

1/24/19
* Just got the chart page usable again after all the library changes

1/25/19
* Got a simple PoC vertical bar chart working after mostly following [this tutorial]. Also referred to [this example](http://bl.ocks.org/d3noob/8952219)

1/26/19
* Decided we're going to need to group the data a bit to show it in one concise chart. The best fit seems to be by college (also the examples Dr. V was showing in class did it this way)
* Researched the most efficient for loop style for ES6 Javascript. Turns out just plain `for (var i =0;)...` loops are the best
* Got a grouping method to work and tested it on a small sample array of data
* Was able to get the grouped data to plot on the chart, but the labels are really long. We're either going to need to display them vertically or slanted.
* Decided this looks pretty terrible and is really hard to read
* Took some time to flip the chart axes. Referred to [this example](http://bl.ocks.org/kiranml1/6872226)
* Created a function to fix college names with the ", College of" suffix to ease readability
* Came across [this example](https://beta.observablehq.com/@mbostock/d3-sortable-bar-chart) of a sortable bar chart but observalehq is really confusing so I went off [this one](https://stackoverflow.com/a/46208867/2307994) and it's fiddle
* Was able to get the bars to sort pretty easily, but had trouble with the labels.
* Really struggled with getting the labels to sort with the bars, so I took some time to write up a simplified version to post on bl.ocks.org and then [posted a question](https://stackoverflow.com/questions/54389499/how-to-move-tick-labels-in-horizontal-bar-chart) on StackOverflow. Someone responded in like 30 minutes with a perfect solution. 
* Integrated the changes from the SO answer
* The chart now sorts perfectly based on value, but gets cut off at bottom and isn't integrated into the template.
* Decided it's time to call Sprint 1. Merged dev into master

**Sprint 2**

1/27/19

* After the merge, I integrated the chart into the overall template and fixed some ensuing problems with it.
* My home internet was experiencing some issues and it made me realize how annoying it is that the browser has to go out and fetch the CSV over AJAX on each page load so I decided to cache it locally in LocalStorage.
* Got LocalStorage caching working for the CSV for both the chart and table page
* Increased the axis fonts a bit to improve readability 
* Added the option to sort alphabetically by college name and moved the sort options to a dropdown
* Added author information to the sidebar footer

1/28/19

* Styled table pagination area to make it black instead of bootstrap blue
* Made table responsive so it hides columns starting at the right, but the search box still stayed there
* Created a listener to hide the search box on columns change
* Created a favicon.ico
* Got the "College of" fix applied to 2 columns in the datatable to make things cleaner
* Added $ value labels to the bars in the chart and got those to move (after some effort) when sorting
* Change sort option labels from "Ascending/Descending" to arrows up/down
* Changed template to get rid of sidebar and put the links into the top bar. Hopefully that helps with some width scaling issues

1/29/19
* Moved task to Incoming: "Show $ value bar labels on hover". Decided it's too hard not worth the effort
* Added copyright to header
* Added x-axis label and adjusted the manual pixels accordingly
* Cleaned up old code
* Completed Sprint 2 2 days early and merged to Master

**Sprint 3**

1/30/19
* Add a gulp task to combine and minify css instead of CDN links
* Started work on the graphing and grouping functions to make it column-name independent. This way we can add functionality to group the data by college/YTD average in addition to college/base average. 

1/31/19
* Added functionality to change the graph to YTD instead of base
* There were too many ticks with the YTD graph so I limited them to 8 manually
* Add v2 of the csv data and edit the column name to use it
* Tried adding a loading icon to show while the table was being generated but the table generates fast enough that the icon doesn't even show before the table appears. Scapped that issue.
* Bold the x-axis label
* Added some classes to the author section of the navbar to hide it on smaller screens
* Got table to be responsive by hiding the search inputs on screens smaller than 1200px. That's when things start to crowd.
* Cleaned up, documented functions, merged final PR, and pushed to AWS


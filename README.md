# Education and Equity: a PISA survey result vizualization

A view of the visualizion:    
[![](https://github.com/Cecilia-x/PISA-visualization/raw/master/pic.PNG)]

## Summary
The PISA 2012 data shows that students from better social economic background generally perform better,
But in some regions more students overcomed socio-economic barriers and excel in the test.
When analysing as a whole, several developing regions outperform the developed ones, demostrated their successful education system.
This project bases on survey result, vizualizes how social economic status 
influence education in different part of the world.

## Design

### Design of Main Graph

The project built linear regression models for each region, coeffienct means how much difference 1 point of ESCS can make to the score, and power of influence means how much difference of score can be explained by ESCS index. The result is shown in bubble chart, with x axis represents socio-economic index (ESCS), y axis represents mean score, size represents the power of influence, and color represents the coefficient.

* CHOOSE OF GRAPH: 

    Bubble chart can convey 4 dimensions of quantitative data. It is suitable for this project.

* CHOOSE OF PROJECTION:

    As the main concern is the relation between social background and test result, the two axises use values of ESCS and score, because distance is the best way to convey quantitative information, by comparing each bubble's position readeres could learn better about relationship between ESCS and score. 

    Although size is not desirable for representing quantitative data, in seismology it has been used for representing earthquake magnitude. People are more readily to connect size to strongness. Therefore I choose size to representing power of influence, and let coefficient represented by color. 

* CHOOSE OF COLOR:

    The color range is from yellow to navy blue, because they are friendly to color blind people.

* THE USAGE OF TIPS

    Tips are added for each bubble. When people get confused of the data represented by size and color, or when they want to inspect a specific country or region, they can move mouse upon the bubble and learn about details of data.

### Design of Control panel

Readers might concern which regions have the most equal or unequal education systems. Althogh coefficient and power of influence are represented by attributes of bubbles, these bubbles are not necessarily group together, thus readers might feel 
too complicated when trying to find such information. The control panel allows readers to filter by selecting different coefficient and power of influence range from sliders, or view different subjects from clicking buttons. In doing so it would be easier to see if educational equity relative to students' performance. Also this filter could allow readers view bubbles overlapped by others.

## Feedback
1. Legend is confusing. The one for coefficient is from low to high, but another is reversed.

    Solution: change position of power of influence legend, put the smaller circle in the left. Also created an illustration of 2 extreme cases beside, one is lowest coefficient and power of influence, another is the opposite.

2. When slide one control bar, another will reset, but readers want two bars to work together.

    Solution: change behavior of slide bars, so that when one change values the other's range will work as well.

3. Bubble in legend are easily confused with other bubbles in the graph.

    Solution: Add background color to the legend so that it can be visually seperated to the rest of the graph.

## Resources
* [PISA 2012 data](http://www.oecd.org/pisa/data/pisa2012database-downloadabledata.htm)
* [PISA 2012 technical report](http://www.oecd.org/pisa/pisaproducts/pisa2012technicalreport.htm)


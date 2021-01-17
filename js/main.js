//The JVCI priority groups
var priorityGroups = [
    {
        name: 'Group 1',
        description: 'Older adults resident in a care home and care home workers',
        number: 1098000
    }, 
    {
        name: 'Group 2',
        description: 'All those 80 years and over an health and social care workers',
        number: 5062000
    },
    {
        name: 'Group 3',
        description: 'All those 75 years of age and over',
        number: 2325296
    },
    {
        name: 'Group 4',
        description: 'All those 70 years of age and over',
        number: 3318867
    },
    {
        name: 'Group 5',
        description: 'All those 65 years of age and over',
        number: 3368199
    },
    {
        name: 'Group 6',
        description: 'All individuals aged 16 years to 64 years with underlying health conditions which put them at higher risk of serious disease and mortality',
        number: 2200000
    },
    {
        name: 'Group 7',
        description: 'All those 60 years of age and over',
        number: 3755185
    },
    {
        name: 'Group 8',
        description: 'All those 55 years of age and over',
        number: 4405908
    },
    {
        name: 'Group 9',
        description: 'All those 50 years of age and over',
        number: 4661105
    }
];

//Stores whether the portrait view is used
var usePortrait = false;

/**
 * Called when page loads
 */
$(function() {
    if ($(document).width() < 700) {
        usePortrait = true;
    }

    //Calculate the total population
    var totalPopulation = 0;
    priorityGroups.forEach(function(group) {
        totalPopulation += group.number;
    });

    //Used to track the rolling total as the graph is drawn
    var rollingTotal = 0;

    //Loop through all the priority groups
    for (var i = 1; i < priorityGroups.length + 1; i++) {
        //Update the rolling total
        rollingTotal += priorityGroups[i-1].number;

        //Calculate the group percentage
        var percentage = (priorityGroups[i-1].number / totalPopulation) * 100;
        
        //Add the group
        var group = addGroup(i, percentage);
        
        //Add the graph labels
        addLabel(group, rollingTotal);
    }

    addDescription();

    //Get the vaccinated json
    $.get('js/vaccinated.json?v='+Date.now(), '', function(response) {
        //Get the latest cumulative dses
        var dose1 = response.data[0].cumPeopleVaccinatedFirstDoseByPublishDate;
        var dose2 = response.data[0].cumPeopleVaccinatedSecondDoseByPublishDate;

        //Calculate the dose percentages
        var dose1Percentage = (dose1 / totalPopulation) * 100;
        var dose2Percentage = (dose2 / totalPopulation) * 100;

        //Set the number of doses text
        $('.first-dose-line .num-doses').text(numberWithCommas(dose1));
        $('.second-dose-line .num-doses').text(numberWithCommas(dose2));

        if (usePortrait) {
            //Draw the doses line
            $('.first-dose-line').animate({
                height: dose1Percentage + '%'
            }, 400, function() {
                $('.second-dose-line').animate({
                    height: dose2Percentage + '%'
                }, 400, function() {
                    $('.title-container').fadeIn();
                });
            });
        } else {
            //Draw the doses line
            $('.first-dose-line').animate({
                width: dose1Percentage + '%'
            }, 400, function() {
                $('.second-dose-line').animate({
                    width: dose2Percentage + '%'
                }, 400, function() {
                    $('.title-container').fadeIn();
                });
            });
        }
    });

    /**
     * Called when hover over priority group
     */
    $('.group-wrapper').mouseenter(function() {
        var id = this.id.replace('group-', '');
        var descriptionText = priorityGroups[id-1].description;
        $('.description p').text(descriptionText);
        $('.description').fadeIn();
    });
    
    /**
     * Called when leave priority group
     */
    $('main').mouseleave(function() {
        $('.description').fadeOut();
    });

    /**
     * Called when read more is clicked
     */
    $('#read-more').click(function(event) {
        $('.overlay').fadeIn();
        $('.overlay-contents').fadeIn();
        event.preventDefault();
    }); 

    /**
     * Called to dismiss read more overlay
     */
    $('.overlay').click(function() {
        $('.overlay').fadeOut();
        $('.overlay-contents').fadeOut();
    });
});

/**
 * Called when the window is resized
 */
$(window).resize(function() {
    repositionBottomLabels();
});

/**
 * Called when the orientation changes
 */
$(window).bind('orientationchange', function(event) {
    location.reload();
});

/**
 * Returns a number with thousands commas
 * @param {*} x 
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Converts a number of millions (m)
 * @param {*} x 
 */
function numberToMillions(x) {
    return (Math.round((x / 1000000) * 10) / 10) + 'm';
}

/**
 * Add a group to the screen
 * @param {*} i 
 * @param {*} percentage 
 */
function addGroup(i, percentage) {
    var group = $('<div class="group-wrapper" id="group-' + i + '"><div class="group-container"><div class="top-group"><div class="group-number">' + i + '</div></div><div class="bottom-group"><div class="group-number">' + i + '</div></div></div></div>');
    $('main').append(group);

    if (usePortrait) {
        group.height(percentage + '%');
    } else {
        group.width(percentage + '%');
    }

    return group;
}

/**
 * Add a label to the screen
 * @param {*} group 
 * @param {*} rollingTotal 
 */
function addLabel(group, rollingTotal) {
    var createLabel = function(rollingTotal, position) {
        return $('<div class="label ' + position + '-label">' + numberToMillions(rollingTotal) + '</div>');
    };

    if (usePortrait) {
        var leftLabel = createLabel(rollingTotal, 'left');
        var top = group.position().top + group.height();
        $('main').append(leftLabel);
        top -= (leftLabel.height() / 2);
        leftLabel.css({left: '-9vw'}).css({top: top}).css({textAlign: 'right'});

        var rightLabel = createLabel(rollingTotal, 'right');
        $('main').append(rightLabel);
        rightLabel.css({right: '-4.5vh'}).css({top: top}).css({textAlign: 'left'});
    } else {
        var topLabel = createLabel(rollingTotal, 'top');
        var left = group.position().left + group.width();
        $('main').append(topLabel);
        left -= (topLabel.width() / 2);
        topLabel.css({top: '-25px'}).css({left: left});

        var bottomLabel = createLabel(rollingTotal, 'bottom');
        $('main').append(bottomLabel);
        bottomLabel.css({top: $('main').height() + 14}).css({left: left});
    }
}

/**
 * Reposition the bottom labels
 */
function repositionBottomLabels() {
    if (!usePortrait) {
        $('.bottom-label').css({top: $('main').height() + 14});
    }
}

/**
 * Add a blank description
 */
function addDescription() {
    var description = $('<div class="description"><p></p></div>');

    if (usePortrait) {
        $('main').before(description);
    } else {
        $('main').append(description);
    }
}
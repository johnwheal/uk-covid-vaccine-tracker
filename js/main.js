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

$(function() {
    var totalPopulation = 0;
    priorityGroups.forEach(function(group) {
        totalPopulation += group.number;
    });

    var rollingTotal = 0;

    for (var i = 1; i < 10; i++) {
        rollingTotal += priorityGroups[i-1].number;
        var percentage = (priorityGroups[i-1].number / totalPopulation) * 100;
        var group = $('#group-'+i);
        group.width(percentage + '%');
        var left = group.position().left + group.width();
        var label = $('<div class="label">' + numberToMillions(rollingTotal) + '</div>');
        
        $('main').append(label);
        left -= (label.width() / 2);
        label.css({top: '-25px'}).css({left: left});

        var left = group.position().left + group.width();
        var label = $('<div class="label">' + numberToMillions(rollingTotal) + '</div>');
        
        $('main').append(label);
        left -= (label.width() / 2);
        label.css({top: $('main').height() + 14}).css({left: left});
    }

    $.get('js/vaccinated.json', '', function(response) {
        var dose1 = response.data[0].cumPeopleVaccinatedFirstDoseByPublishDate;
        var dose2 = response.data[0].cumPeopleVaccinatedSecondDoseByPublishDate;

        var dose1Percentage = (dose1 / totalPopulation) * 100;
        var dose2Percentage = (dose2 / totalPopulation) * 100;

        $('.first-dose-line').width(dose1Percentage + '%');
        $('.second-dose-line').width(dose2Percentage + '%');

        $('.first-dose-line .num-doses').text(numberWithCommas(dose1));
        $('.second-dose-line .num-doses').text(numberWithCommas(dose2));
    });

});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberToMillions(x) {
    return (Math.round((x / 1000000) * 10) / 10) + 'm';
}
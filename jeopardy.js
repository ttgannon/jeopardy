// A jeopardy game using jService API for Springboard Software Engineering Career Track final assessment 1. 

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */


async function getCategoryIds() {
    let categories = [];
    let offset = Math.floor(Math.random()*28150);
    const categoriesObject = await axios.get(`https://jservice.io/api/categories?count=6&offset=${offset}`);
    for (let key in categoriesObject.data) {
        categories.push(categoriesObject.data[key].id);
    }
    return categories;
}


async function getCategory(catId) {
    let tableDisplay = {};
    for (let i = 0; i < catId.length; i++) {
        let clueArray = [];
        let categoryClues = await axios.get(`https://jservice.io/api/clues?category=${catId[i]}`);
        let categoryTitle = categoryClues.data[0].category.title;
         
        for (let j = 0; j < categoryClues.data.length; j++) {
            let clueObject = {
            question: categoryClues.data[j].question,
            answer: categoryClues.data[j].answer
            }
            clueArray.push(clueObject);
        }
        tableDisplay[categoryTitle] = {
            title: categoryTitle,
            clues: clueArray
        };
       
    }
    return tableDisplay;
}



let cluesArray = [];
let insideCluesArray = [];
let $jeopardyTable;
async function fillTable(tableDisplay) {
    $jeopardyTable = $("<div>").addClass('container');
    let $row;
    let selectedNumbers = {};
    let tableData = {};
    
    $('body').append($jeopardyTable);
    for (let i = 0; i < 6; i++) {
        $row = $('<div>').addClass('row align-items-center rowClass');
            for (let key in tableDisplay) {
                if (i === 0) {
                    $column = $('<div>').addClass('col myClass text-break text-fit').css("background-color", "blue").text(`${(tableDisplay[key].title).toUpperCase()}`);
                    $row.append($column);
                    $jeopardyTable.append($row);
                }
                else {
                    $column = $('<div>').addClass('col text-center align-middle translate-middle').css("background-color", "blue").text('?');
                    $column.on("click", handleClick);
                    selectedNumbers.title = tableDisplay[key].title;
                    selectedNumbers.clues = insideCluesArray;

                    if (tableDisplay[key].clues.length < 5) {
                        for (let k = 0; k < tableDisplay[key].clues.length; k++) {
                            insideCluesArray.push(tableDisplay[key].clues[k]);
                            cluesArray.push(tableDisplay[key].clues[k]);
                        }
                        
                    }
                    else {
                        do {
                            randomNumber = Math.floor(Math.random() * tableDisplay[key].clues.length);
                        } while (insideCluesArray.includes(tableDisplay[key].clues[randomNumber]) || tableDisplay[key].clues[randomNumber] === undefined);
                        
                        insideCluesArray.push(tableDisplay[key].clues[randomNumber]);
                        cluesArray.push(tableDisplay[key].clues[randomNumber]);
                        
                    }
                
                    $column.attr('data-key', key); 
                    $column.attr('data-index', cluesArray.length - 1); 
                    $row.append($column);
                    $jeopardyTable.append($row);
                }  
                
    }
}
return cluesArray;
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let index = $(evt.target).attr('data-index');
    let clue = cluesArray[index].question;
    let clueAnswer = cluesArray[index].answer;
    
    if ($(evt.target).hasClass('showing')) {
        $(evt.target).text(clueAnswer);
    }
    else {
        $(evt.target).text(clue).addClass("showing");
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
/** Remove the loading spinner and update the button used to fetch data. */

let $spinningDiv;
function hideLoadingView() {
    $spinningDiv.remove();
    $button.text("New Game");
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

let $button;
let $buttonDiv;
$(document).ready(function() {
    $buttonDiv = $('<div class="position-relative"></div>');
    $button = $(`<button id='gameStart' type='button' class='btn btn-primary position-absolute top-0 start-0 translate-middle'>It's Jeopardy!</button>`);
    const $intro = $(`<h1 id='jeopardyIntro'>Jeopardy!</h1>`);
    $button.on("click", setupAndStart);
    $buttonDiv.append($button);
    $('body')
    .append($intro)
    .append($buttonDiv);
    
});

function showLoadingView() {
    $spinningDivDiv = $('<div class="text-center"></div>');
    $spinningDiv = $(`<div class='spinner-border' role='status'>`);
    $spinningDivDiv.append($spinningDiv);
    $('body').append($spinningDivDiv);
}


async function setupAndStart() {
    showLoadingView();
    if ($jeopardyTable) {
        $jeopardyTable.remove();
    }
    let categories = await getCategoryIds();
    let tableDisplay = await getCategory(categories);
    await fillTable(tableDisplay);
    hideLoadingView();
}






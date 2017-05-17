

$(document).ready(function() {


    $('#addBtn').click(function() {
      addCharacter();
    });


    $('.generateBtn').click( () => {
      console.log('clicked generate');
      let query = constructQuery();
      console.log('query: ', query);
      if(query !== null) generateScript(query);
    });

});

const MAX_CHARACTERS = 2;
let characters = 0;




/* 
        p Enter the name of your character
        input
        p Enter a short description of your character 
        textarea.autoExpand(rows='3' data-min-rows='3' placeholder='Character description')

*/

function addCharacter() {
    if (characters >= MAX_CHARACTERS) return;
    characters++;
    let list = $('.list');
    
    let nameText = $('<p>Enter the name of your character</p>');
    let nameInput = $('<input/>').addClass('name');
    let descriptionText = $('<p>Enter a short description of your character</p>');
    let descriptionInput = $('<textarea class="autoExpand description" rows="3" data-min-rows="3" placeholder="Character description"></textarea>')

    let entry = $('<div/>').addClass('entry');

    entry.append(nameText);
    entry.append(nameInput);
    entry.append(descriptionText);
    entry.append(descriptionInput);
    
    list.append(entry);
}


function addExpandableTextArea() {
    //Auto expanding textarea - CODEPEN STUFF
    $(document).one('focus.autoExpand', 'textarea.autoExpand', function() {
            let savedValue = this.value;
            this.value = '';
            this.baseScrollHeight = this.scrollHeight;
            this.value = savedValue;
        })
        .on('input.autoExpand', 'textarea.autoExpand', function() {
            let minRows = this.getAttribute('data-min-rows') | 0,
                rows;
            this.rows = minRows;
            rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
            this.rows = minRows + rows;
        });
}

function generateScript(query){
    query = JSON.stringify(query);
    $.post('/generateScript', {query}, function(response) {
      console.log('got the following response: ');
      console.log(response);
      displayScript(response);
    });

}

function constructQuery() {
  let query = {
    title : '',
    characters : [],
    plot : '',
  }
  query.title = $('.oneliner').val();
  console.log(query.title);
  if(!onlyLetters(query.title))
  {
    console.log('title contains something other than letters');
    errorMsg('title'); 
    return null;
  } 

  let entries = $('.entry');
  
  if(entries.length < 2){
    alert('Please enter two characters');
    return null;
  }  
  let characters = [];
  for(let i = 0; i<entries.length; i++)
  {
    let characterName = $(entries[i]).find('.name').val();
    if(!onlyLetters(characterName)){
      console.log('a character name contains something other than letters');
      errorMsg('character name');
      return null;
    }  
    let characterDescription = $(entries[i]).find('textarea.description').val();
    if(!onlyLetters(characterDescription)){
      console.log('a character description contains something other than letters');
      errorMsg('character description');
      return null;
    }  
    characters.push({name : characterName, description : characterDescription});
  }

  query.characters = characters;

  query.plot = $('.plotInput').val();
  if(!onlyLetters(query.plot)){
    console.log('plot failed');
    errorMsg('plot');
    return null;
  }

  return query;

}

function onlyLetters(string){
  return /^\w+(\s+\w+)*$/.test(string);
  //return /^[a-z., ],+$/i.test(string);
}

function errorMsg(type) {
  alert('Your ' + type + ' is either empty or contains illegal characters');
}

function displayScript(script){
  let screenplay = $('.screenplay');
  screenplay.empty();
  let title = $('<h1/>').text(script.title);  
  screenplay.append(title);
  let scenes = script.scenes;

  for(let i = 0; i<scenes.length; i++)
  {
    let dialogue = scenes[i].dialogue;
    let headingText = scenes[i].heading;
    let actionText = scenes[i].action;
    let scene = $('<div/>')
    let heading = $('<h3/>').text(headingText).addClass('heading');
    let action = $('<i/>').text(actionText).addClass('action');
    scene.append(heading);
    scene.append(action);
    scene.append(parseDialogue(dialogue));
    screenplay.append(scene);
  }

  displayEmail();
}

/*
      p Save this script by emailing it
      input.titleInput
      button.generateBtn SEND
*/

function displayEmail() {
  let send = $('.send');
  send.empty();
  let text = $('<p/>').text('Enter your email and press send to save the script');
  let input = $('<input/>').addClass('oneliner email');
  let sendBtn = $('<button/>').addClass('sendBtn').text('SEND').click( () => {
    console.log('clicked send');
    sendEmail();
  });
  send.append(text);
  send.append(input);
  send.append(sendBtn);

}

function sendEmail() {
  let email = $('.email').val();
  console.log('email value: ', email);
  $.post('/sendScript', {email}, function(response) {    
    console.log('**EMAIL RESPONSE**: ');
    console.log(response);
    alert(response.message);
});
}

function parseDialogue(dialogue){
  let dialogueDiv = $('<div/>');
  for(let i = 0; i<dialogue.length; i++)
  {
    let sentence = $('</p>').text(dialogue[i]);
    dialogueDiv.append(sentence);
  }
  return dialogueDiv;
}

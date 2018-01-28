var gstats = {
    playSound: true //on active-désactive le son
};

var game = new Array({
   mouseX : 0,
   mouseY : 0,

   paused : false,
   click : false
});

var sound = new Array(
    {key: "sword", source: "sword.mp3"},
    {key: "caverne", source: "caverne.mp3"},
    {key: "voix-texte-1", source: "caverne.mp3"}
);

var event = new Array(

    {type: 'SPRITE', class:"character-one", posx: 0, posy: 150},
    {type: 'MOVE', class:"character-one", sprite: "charactere-move", posx: 0, posx_obj: 150, posy: 150, vitesse: 6},

    {type: 'TEXT', soundplay: "sword", soundrepeat: false, sprite: "maya-question", spriteStop: "maya-question-stop", text: "Bonjour ? Qui Ãªtes-vous ?", option: "fondu"},

    {type: 'SOUND', key: "caverne", soundrepeat: false },


    {type: 'TEXT', sprite: "maya-reflexion", spriteStop: "maya-reflexion-stop", text: "Pouvez-vous m'aider ?"},
    {type: 'TEXT', sprite: "maya-reflexion-stop", spriteStop: "maya-reflexion-stop", text: "..."},
    {type: 'TEXT', sprite: "maya-reflexion", spriteStop: "maya-reflexion-stop", text: "Je cherche le directeur, on m'a dit qu'il s'appelait Boutade"},
    {type: 'TEXT', sprite: "maya-reflexion-stop", spriteStop: "maya-reflexion-stop", text: "..."},
    {type: 'TEXT', sprite: "maya-reflexion", spriteStop: "maya-excitation-stop", text: "..."},
    {type: 'TEXT', sprite: "maya-question", spriteStop: "maya-question-stop", text: "Vous aussi vous Ãªtes ici pour les inscriptions de l'Access Code School ?!"},
    {type: 'TEXT', sprite: "maya-excitation", spriteStop: "maya-excitation-stop", text: "Je suis tellement exitée de m'inscrire, pas vous ?"},
    {type: 'TEXT', sprite: "maya-triste", spriteStop: "maya-triste-stop", text: "Il n'y plus beaucoup de place, j'espère que l'on sera pris"}
);

var script = new Array(

);

var i = 0;
var intervalText = false;
function lireText(chaine = "coucou"){
   var nbCaracere = chaine.length;
   var textbox = document.getElementsByClassName("tbox-content")[0];
   var content = "";

   content = chaine.substring(0, i);
   textbox.innerHTML = content;
   i ++;

   if(i == (nbCaracere + 1)){
       i = 0;
       clearInterval(intervalText);
       intervalText = false;
   }
}

var intervalMove = true;
function MoveSprite(e = new Array(), sprite = ""){
    if(e.posx_obj && sprite.offsetLeft < e.posx_obj){
        console.log('dev');
        console.log(sprite.style.offsetLeft);
        sprite.style.left = (sprite.offsetLeft + e.vitesse)+'px';
    }
    else{
        console.log('ok');
        clearInterval(intervalMove);
        game.click = false;
    }
}

var e_actuel = -1;
var intervalEvent;
var action_joueur = 0;
var sprite;
function lectureEvent(){
   var caractere = document.getElementsByClassName("caractere")[0];
   var screen = document.getElementById("screen1");

   if(e_actuel < (event.length - 1)){
       if(!intervalText && action_joueur != e_actuel){
           e_actuel = action_joueur;

           //si l'event actuel est supÃ©rieur Ã  0 on supprime la prÃ©cÃ©dente div
           if(e_actuel > 0){
               caractere.classList.remove("fondu");
               caractere.classList.remove(event[e_actuel - 1].spriteStop);
               caractere.classList.remove(event[e_actuel - 1].sprite);
           }

           //changement de la sprite dans la div
           if(event[e_actuel].option){
               console.log('fondu');
               caractere.className = "fondu caractere";
           }

           sprite = event[e_actuel].sprite;
           if(!caractere.classList.contains(sprite)){
               caractere.classList.add(sprite);
           }

           if(event[e_actuel].background){
               console.log('dev');
               screen.className = event[e_actuel].background;
           }

           //chaine de caractere dites par le personnage
           if(event[e_actuel].type == 'TEXT'){
               chaine = event[e_actuel].text;
               if(event[e_actuel].soundplay){
                   playSound(event[e_actuel].soundplay, event[e_actuel].soundrepeat);
               }
               intervalText = setInterval((function(){lireText(chaine); }), 100); //on joue l'interval de texte qiu dois balancer le bordel
           }
           else if(event[e_actuel].type == 'SOUND'){
                s_key = event[e_actuel].key;
                playSound(s_key, event[e_actuel].soundrepeat);
                game.click = false;
           }
           else if(event[e_actuel].type == 'SPRITE'){
               var s = document.getElementsByClassName(event[e_actuel].class)[0];
               s.style.top = event[e_actuel].posy;
               s.style.left = event[e_actuel].posx;

               if(event[e_actuel].sprite){
                   s.className = event[e_actuel].sprite;
               }
               game.click = true;
           }
           else if(event[e_actuel].type == 'MOVE'){
                var sprite = document.getElementsByClassName(event[e_actuel].class)[0];
                if(sprite){
                   sprite.style.top = event[e_actuel].posy;
                   sprite.style.left = event[e_actuel].posx;
                   intervalMove = setInterval((function(){MoveSprite(event[e_actuel], sprite); }), 300); //on joue l'interval de texte qiu dois balancer le bordel
               }
           }
           else{
               console.log('erreur'+e_actuel);
           }
       }
       else{
           //e_actuel ++;
           if((!intervalText || !intervalMove) && caractere.classList.contains(sprite)){
               caractere.classList.remove(sprite);
               sprite2 = event[e_actuel].spriteStop;
               caractere.classList.add(sprite2);
               game.click = false;
           }
       }
   }
   else{
       clearInterval(intervalEvent);
   }
}

$.ready(document, (function(){
   intervalEvent = setInterval(lectureEvent, 300);


   for(var s = 0; s < sound.length; s ++){
       loadSound("ressources/audio/"+sound[s].source, sound[s].key);
   }

   $.click(".button-next", (function(){
       if(!game.click){
           action_joueur ++;
           game.click = true;
           console.log("dev");
       }
       else{
           console.log('erreur');
       }
   }));

   $.mousemove("#screen2", (function(e){
       var screen2 = document.querySelectorAll("#screen2")[0];
       var game = document.querySelectorAll("#game")[0];

       game.mouseX = (e.clientX - game.offsetLeft);     // Get the horizontal coordinate
       game.mouseY = (e.clientY - game.offsetTop) - 190;
   }));

}));

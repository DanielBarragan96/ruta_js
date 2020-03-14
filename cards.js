var cards = [];
var card_selected = false;
var board_padding = 20;
var grid_widht = 263;
var grid_height = 120;
var grid_lines = 10;

function setup() {
  createCanvas(1900, 3000);
  cards.push(new Card('Glez', 'Buga', '1Dem/1Ext20/5Mod/5Mon', 100, 100, true, 1));
  cards.push(new Card('Barra', 'Costa', '10Mod/10Mon',250, 250, false, 2));
  cards.push(new Card('Otro', 'Minerva', '300Duela1.5/250Duela3m',360, 350, false, 3));
  
  for (var i = cards.length - 1; i >= 0; i--) {
    cards[i].reposition();
  }
}

function mousePressed() {
  
    if(this.card_selected){
      this.card_selected = false;
      for (var i = cards.length - 1; i >= 0; i--) {
        if (cards[i].get_drag()) {
          cards[i].set_drag(false);
		  cards[i].reposition();
          return;
        }
      }
    }
    else {
      this.card_selected = true;
      for (var i = cards.length - 1; i >= 0; i--) {
        if (cards[i].clicked(mouseX, mouseY)) {
          cards[i].set_drag(true);
          cards.unshift(cards[i]);
          cards.splice(i + 1, 1);
          return;
        }
      }
    }
  
}

function draw() {
  background(50);
  
	//Draw grid
	stroke(255,0,0);
	for(var i = this.board_padding; i <= width; i += grid_widht) {
		line(i, 1, i+grid_lines, height);
	}
	for(var i = this.board_padding*3; i <= height; i += grid_height) {
		line(1, i, width, i+grid_lines);
	}
  
  //Render cards
  stroke(200);
  for (var i = cards.length - 1; i >= 0; i--) {
    if(cards[i].get_drag() && this.card_selected) {
      cards[i].update_pos(mouseX, mouseY);   
    }
    cards[i].show();
  }
}

function Card(name, construction, items, x=0, y=0, entry=true, id=-1){
  this.name = name;
  this.construction = construction;
  this.items = items;
  this.x = x;
  this.y = y;
  this.entry = entry;
  this.id = id;
  this.card_width = grid_widht;
  this.card_height = grid_height;
  this.drag = false;
  this.offset_center_x = this.card_width/2;
  this.offset_center_y = this.card_height/2;
  this.card_padding = 20;
  this.text_padding = 5;
  
  this.entry_color = color(0,180,0);
  this.exit_color = color(180,0,0);
  
  this.update_pos = function(new_x, new_y) {
    this.x = new_x - this.offset_center_x;
    this.y = new_y - this.offset_center_y;
  }
  
  this.clicked = function(mouse_x, mouse_y) {
    ver1 = this.x;
    ver2 = this.x + this.card_width;
    ver3 = this.y;
    ver4 = this.y + this.card_height;
    if ((mouse_x > ver1) && (mouse_x < ver2) && (mouse_y > ver3) && (mouse_y < ver4)) {
      return true;
    } else {
      return false;
    }
  };
  
  this.set_drag = function(new_drag) {
    this.drag = new_drag;
  }
  
  this.get_drag = function() {
    return this.drag;
  }
  
  this.reposition = function() {
	  fixed_x = grid_widht + this.card_padding;
	  fixed_y = grid_height + (board_padding*3);
	  col = 0;
	  row = 0;
	  
	  while(this.x > fixed_x){
		  fixed_x += grid_widht;
		  col++;
	  }
	  this.x = (col * grid_widht) + grid_lines;
	  
	  while(this.y > fixed_y){
		  fixed_y += grid_height;
		  row++;
	  }
	  this.y = (row * grid_height) + grid_lines;
	  
	  console.log(''+row+' - '+col);
	  return;
  }

  
  this.show = function(){
    noStroke();
    (this.entry) ? (fill(this.entry_color)) : (fill(this.exit_color));
	
	ver1 = this.x + this.card_padding;
    ver2 = this.y + this.card_padding*3;
    ver3 = this.card_width - this.card_padding;
    ver4 = this.card_height - this.card_padding;
	rect(ver1, ver2, ver3, ver4);
	
	textSize(18);
	fill(500);
	msg = this.name + "\n" + this.construction + "\n";
	msg += this.items;
	text(msg, ver1 + this.text_padding , ver2 + this.text_padding , ver3 - this.text_padding , ver4 - this.text_padding );
  }
  
}
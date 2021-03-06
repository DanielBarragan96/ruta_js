var cards = [];
var card_selected = false;
var grid_widht = 263;
var grid_height = 120;
var grid_lines = 10;
var debug = true;
var curr_time = 0;
var grid_padding = 80;

var n;
var m;
var i = 0;

function setup() {
  createCanvas(1900, 3000);
  frameRate(30);

  cards.push(new Card('Glez', 'Buga', '1Dem/1Ext20/5Mod/5Mon', 0, 0, true, 1));
  cards.push(new Card('Barra', 'Costa', '10Mod/10Mon', 1, 0, false, 2));
  cards.push(new Card('Otro', 'Minerva', '300Duela1.5/250Duela3m', 2, 0, false, 3));

  for (var i = cards.length - 1; i >= 0; i--) {
    //cards[i].reposition();
  }
}

function mouseReleased() {
  this.card_selected = false;
  for (var i = cards.length - 1; i >= 0; i--) {
    if (cards[i].get_drag() && curr_time == 0) {
      cards[i].set_drag(false);
      cards[i].card_dropped();
      return;
    }
  }
}

function doubleClick() {
  console.log("DOUBLE");
  this.card_selected = false;
  for (var i = cards.length - 1; i >= 0; i--) {
    cards[i].set_drag(false);
  }
}

function mousePressed() {
  this.card_selected = true;
  if (curr_time < 1)
    curr_time = 1;
  else {
    if (curr_time < 10) {
      doubleClick();
      return;
    } else
      curr_time = 1;
  }

  for (var i = cards.length - 1; i >= 0; i--) {
    if (cards[i].clicked(mouseX, mouseY)) {
      cards[i].set_drag(true);
      cards.unshift(cards[i]);
      cards.splice(i + 1, 1);
      return;
    }
  }
}

function draw() {
  background(50);
  //translate(grid_padding/2,grid_padding);
  if (curr_time > 0) {
    curr_time++;
    curr_time = (curr_time > 10) ? 0 : curr_time;
  }

  //Draw grid
  if (debug) {
    stroke(255, 0, 0);
    for (var i = grid_widht; i <= width; i += grid_widht) {
      line(i, 1, i, height);
    }
    for (var i = grid_height; i <= height; i += grid_height) {
      line(1, i, width, i);
    }
  }

  //Render cards
  stroke(200);
  for (var i = cards.length - 1; i >= 0; i--) {
    if (cards[i].get_drag() && this.card_selected && curr_time == 0) {
      cards[i].update_pos(mouseX, mouseY);
    }
    cards[i].show();
  }
  //translate(0,0);
}

function Card(name, construction, items, row = 0, col = 0, entry = true, id = -1) {
  this.name = name;
  this.construction = construction;
  this.items = items;
  this.row = row;
  this.col = col;
  this.entry = entry;
  this.id = id;
  this.card_width = grid_widht;
  this.card_height = grid_height;
  this.drag = false;
  this.offset_center_x = this.card_width / 2;
  this.offset_center_y = this.card_height / 2;
  this.card_padding = 10;
  this.text_padding = 5;
  this.x = 0;
  this.y = 0

  this.entry_color = color(0, 180, 0);
  this.exit_color = color(180, 0, 0);

  this.update_pos = function(new_x, new_y) {
    this.x = new_x - this.offset_center_x;
    this.y = new_y - this.offset_center_y;
  }

  this.card_dropped = function() {
    this.x += this.offset_center_x;
    this.y += this.offset_center_y;
    fixed_x = grid_widht;
	  fixed_y = grid_height;
	  aux_col = 0;
	  aux_row = 0;

	  while(this.x >= fixed_x){
		  fixed_x += grid_widht;
		  aux_col++;
	  }
	  this.x = (aux_col * grid_widht);

	  while(this.y >= fixed_y){
		  fixed_y += grid_height;
		  aux_row++;
	  }
	  this.y = (aux_row * grid_height);

	  console.log('' + aux_row + ' - ' + aux_col);

    this.row = aux_row;
    this.col = aux_col;

	  return;
  }

  this.clicked = function(mouse_x, mouse_y) {
    fixed_x = grid_widht;
    fixed_y = grid_height;
    col = 0;
    row = 0;

    while(mouse_x >= fixed_x){
      fixed_x += grid_widht;
      col++;
    }
    while(mouse_y >= fixed_y){
      fixed_y += grid_height;
      row++;
    }

    return (this.row == row && this.col == col);
  };

  this.set_drag = function(new_drag) {
    this.drag = new_drag;
  }

  this.get_drag = function() {
    return this.drag;
  }

  this.reposition = function() {
    fixed_x = grid_widht;
    fixed_y = grid_height;
    col = 0;
    row = 0;

    while (this.row >= fixed_x) {
      fixed_x += grid_widht;
      col++;
    }
    this.x = (col * grid_widht);

    while (this.col >= fixed_y) {
      fixed_y += grid_height;
      row++;
    }
    this.y = (row * grid_height);

    console.log('' + row + ' - ' + col);
    this.row = row;
    this.col = col;
    return;
  }


  this.show = function() {
    if(this.drag) {
      ver1 = this.x + this.card_padding;
      ver2 = this.y + this.card_padding;
      ver3 = this.card_width - (2 * this.card_padding);
      ver4 = this.card_height - (2 * this.card_padding);

      noStroke();
      (this.entry) ? (fill(this.entry_color)) : (fill(this.exit_color));
      rect(ver1, ver2, ver3, ver4);

    	textSize(18);
    	fill(500);
    	msg = this.name + "\n" + this.construction + "\n";
    	msg += this.items;
    	text(msg, ver1 + this.text_padding , ver2 + this.text_padding , ver3 - this.text_padding , ver4 - this.text_padding );

      fill(color(255,255,0))
      ver1 = this.x + ((1.5 * this.card_width / 2) - this.card_padding);
      ver2 = ver2;
      ver3 = this.card_padding / 2 + (ver3 / 4);
      ver4 = this.card_padding / 2 + (ver4 / 4);
      rect(ver1, ver2, ver3, ver4);
    }
    else {
      ver1 = (this.col * grid_widht) + this.card_padding;
      ver2 = (this.row * grid_height) + this.card_padding;
      ver3 = this.card_width - (2 * this.card_padding);
      ver4 = this.card_height - (2 * this.card_padding);

      noStroke();
      (this.entry) ? (fill(this.entry_color)) : (fill(this.exit_color));
      rect(ver1, ver2, ver3, ver4);

      textSize(18);
      fill(500);
      msg = this.name + "\n" + this.construction + "\n";
      msg += this.items;
      text(msg, ver1 + this.text_padding, ver2 + this.text_padding, ver3 - this.text_padding, ver4 - this.text_padding);

      fill(color(255, 255, 0))
      ver1 = (this.col * grid_widht) + ((1.5 * this.card_width / 2) - this.card_padding);
      ver2 = ver2;
      ver3 = this.card_padding / 2 + (ver3 / 4);
      ver4 = this.card_padding / 2 + (ver4 / 4);
      rect(ver1, ver2, ver3, ver4);
    }
  }

}

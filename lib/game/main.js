ig.module( 
	'game.main' 
)
.requires(
	'plugins.fixed-tick',
	'impact.debug.debug',	
	'impact.game',
	'impact.font',
	'game.entities.player'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	averageFPS: 0,
	lastDraw: Date.now(),
	
	init: function() {
		ig.input.bind( ig.KEY.UP_ARROW, 'UP' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'DOWN' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'LEFT' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'RIGHT' );
		this.spawnEntity( EntityPlayer, 8, 48 );
		ig.system.tickRate = 5;
	},
	
	update: function() {
		this.parent();
		
		// update tick rate
		var n = 5;
		if( ig.input.pressed('UP') ) { ig.system.tickRate += n; }
		if( ig.input.pressed('DOWN') ) { ig.system.tickRate -= n; }
		ig.system.tickRate = ig.system.tickRate.limit( n, 100 );
	},
	
	draw: function() {
		this.parent();

		// calculate FPS
		var now = Date.now();
		var delta = Date.now() - this.lastDraw;
		this.averageFPS = this.averageFPS * 0.8 + (1000 / delta) * 0.2;
		this.lastDraw = now;

		var text = "left/right arrows move entity\n" +
		           "up/down arrows increase/decrease tick rate\n" +
				   "ig.system.tickRate: " + ig.system.tickRate + "\n" +
				   "FPS: " + this.averageFPS.round();
		this.font.draw( text, 8, 8 );
	}
});


ig.main( '#canvas', MyGame, 60, 320, 72, 2 );

});

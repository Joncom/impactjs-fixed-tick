ig.module('game.entities.player')
.requires('impact.entity')
.defines(function() {

    EntityPlayer = ig.Entity.extend({

        animSheet: new ig.AnimationSheet( 'media/tilesheet.png', 16, 16 ),
        speed: 100,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'DEFAULT', 1, [0, 1 ,2] );
        },

        update: function() {

            // movement
            this.vel.x = 0;
            if( ig.input.state('LEFT') ) { this.vel.x = -this.speed; }
            if( ig.input.state('RIGHT') ) { this.vel.x = this.speed; }

            this.parent();
            this.pos.x = this.pos.x.limit( 8, ig.system.width - this.size.x - 8 );
        }
    });

});
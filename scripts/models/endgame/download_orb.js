class DownloadOrb extends Orb{
  constructor(i, parent, theta){
    super({
      message: "download"
    , fillColor: colors.alto
    , textColor: colors.black
    , theta: theta
    , show: true
    , radius: 1.25*geometry.ORB_MAX_RADIUS
    , semiMajorAxis: 6*geometry.RADIUS
    , primaryY : H - 2.25*geometry.ORB_MAX_RADIUS
    });

    this.outlineColor = colors.outline;
    this.parent = parent;
    this.state = false;
    this.parent.orbs.push(this);
    this.parent.clickables.push(this);
    this.parent.repositionables.push(this);
    this.tS = utility.setTextSize(fonts.letters, this.parent.redirectOrbTextSizeTest, 24, this.radius * 2 - 5)


  }
  invertColors(){
    var temp = this.fillColor;
    this.fillColor = this.textColor;
    this.textColor = temp;
  }

  onClick(){
    /* if inside execute new loop or function */
    this.invertColors();
    this.state = true;
  }

  onRelease(){
    this.invertColors();
    this.parent.dlreq();
    this.state = false;
  }

  display(){
    //fill(this.outlineColor);
    //circle(this.u, this.v, 2*this.radius + 1);
    super.display();
  }

  resize(){
    this.semiMajorAxis = 6*geometry.RADIUS;
    this.radius = 1.25*geometry.ORB_MAX_RADIUS;
    this.tS = utility.setTextSize(fonts.letters, this.parent.redirectOrbTextSizeTest, 24, this.radius * 2 - 5)
    this.primaryX = CX;
    this.primaryY = H - 2.25*geometry.ORB_MAX_RADIUS;
    this.u = this.primaryX + this.semiMajorAxis*Math.cos(this.theta);
    this.v = this.primaryY + this.semiMajorAxis*Math.sin(this.theta);
  }

}

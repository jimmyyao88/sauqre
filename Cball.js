function CBall(iID, oParentContainer) {
    var _oParentContainer;
    var _oBallContainer;
    var _oBall;
    var _oStartPos;
    var _oUserData;

    var _vPos;
    var _vPrevPos;
    var _vCurForce;
    
    var _iID;
    var _iRadius;
    var _iSquareRadius;
    var _iRadiusWithTolerance;
    var _iSquareRadiusForCollisionAngles;
    
    var _bLaunched;
    var _bStopped;
    
    this._init = function (iID) {
        var oStartPosition = s_oGame.getBallStartPosition();
        var iXPos = oStartPosition.x;
        var iYPos = oStartPosition.y;
        _oStartPos = {x: iXPos, y: iYPos};
        _iID = iID;        
        _bLaunched = false;
        _bStopped = false;
        
        _oBallContainer = new createjs.Container();

        var oSprite = s_oSpriteLibrary.getSprite('ball');
        _oBall = createBitmap(oSprite,oSprite.width, oSprite.height);
        _oBall.regX = oSprite.width/2;
        _oBall.regY = oSprite.height/2;        
        _oBallContainer.addChild(_oBall);
        _oBallContainer.x = iXPos;
        _oBallContainer.y = iYPos;

        _vPos = new CVector2();
        _vPos.set(_oBallContainer.x, _oBallContainer.y);
        _vPrevPos = new CVector2();
        _vPrevPos.set(0, 0);

        _iRadius = (oSprite.width * 0.5);
        _iSquareRadius = _iRadius*_iRadius;
        _iRadiusWithTolerance = _iRadius * BALL_RADIUS_TOLERANCE_FACTOR;
        _iSquareRadiusForCollisionAngles = _iSquareRadius * 1;
        _vCurForce = new CVector2(0,0);
        _oParentContainer.addChild(_oBallContainer);
    };

    this.unload = function () {
        _oParentContainer.removeChild(_oBallContainer);
    };

    this.setVisible = function (bVisible) {
        _oBallContainer.visible = bVisible;
    };

    this.setPosition = function (iXPos, iYPos) {
        _oBallContainer.x = iXPos;
        _oBallContainer.y = iYPos;
    };

    this.resetPos = function () {
        _oBallContainer.x = _oStartPos.x;
        _oBallContainer.y = _oStartPos.y;
        _vPos.set(_oBallContainer.x, _oBallContainer.y);
        _vCurForce.set(0, 0);        
    };

    this.isLaunched = function(){
        return _bLaunched;
    };

    this.setLaunched = function(bValue){
        _bLaunched = bValue;
    };
    
    this.isStopped = function(){
        return _bStopped;
    };

    this.stopBall = function(){
        _bLaunched = false;
        _bStopped = true;
        _vCurForce.set(0, 0);
        
        // CHECK IF THE BALL IS THE FIRST TO FALL, TO RESET THE START POSITION
        var oStartBallPosition = s_oGame.getBallStartPosition();
        if ( oStartBallPosition.x === 0 && oStartBallPosition.y === 0 ) {
            s_oGame.setBallStartPosition(_oBallContainer.x);
        };
    };

    this.setStopped = function(bValue){
        _bStopped = bValue;
    };

    this.resetBallPosition = function(iX, iY){
        _vPos.set(iX, iY);
        _oBallContainer.y = iY;
        
        var oParent = this;
        createjs.Tween.get(_oBallContainer)
            .to({x: _vPos.getX()}, 400, createjs.Ease.sineOut)
            .call(function(){
                createjs.Tween.removeTweens(oParent.getContainer());
                oParent.setStopped(false);
            });      
    };
    
    this.getSquareRadiusForCollisionAngles = function(){
        return _iSquareRadiusForCollisionAngles;
    };
    
    this.getContainer = function(){
        return _oBallContainer;
    };    

    this.setAngle = function (iAngle) {
        _oBall.rotation = iAngle;
    };

    this.getX = function () {
        return _oBallContainer.x;
    };
    
    this.getY = function () {
        return _oBallContainer.y;
    };
    
    this.getRadiusWithTolerance = function(){
        return _iRadiusWithTolerance;
    };
    
    this.setUserData = function(oObject){
       _oUserData = oObject; 
    };
    
    this.getUserData = function(){
       return _oUserData; 
    };

    this.scale = function (fValue) {
        _oBallContainer.scaleX = fValue;
        _oBallContainer.scaleY = fValue;
    };

    this.getScale = function () {
        return _oBallContainer.scaleX;
    };

    this.vCurForce = function () {
        return _vCurForce;
    };

    this.vPos = function () {
        return _vPos;
    };

    this.setPos = function (vPos) {
        _vPos.setV(vPos);
    };

    this.vPrevPos = function () {
        return _vPrevPos;
    };

    this.getRadius = function () {
        return _iRadius;
    };

    this.getSquareRadius = function(){
        return _iSquareRadius;
    };

    this.updateSpritePosition = function () {
        _oBallContainer.x = _vPos.getX();
        _oBallContainer.y = _vPos.getY();
    };

    this.getID = function () {
        return _iID;
    };
    
    _oParentContainer = oParentContainer;

    this._init(iID);

    return this;
}

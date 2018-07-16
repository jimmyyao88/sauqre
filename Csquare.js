function CSquare(iRow, iColumn, iType, iValue, oMatrixContainer, iSquareID){
    var _oMatrixContainer;
    var _oSquareContainer;
    var _oSquareSprite;
    var _oBonusSquare;
    var _oValueText;
    var _oFadeTween;
    var _oMovementTween;
    var _oExcludeSquareCollisionRectangle;

    var _iTextOffset;
    var _iColumn;
    var _iRow;
    var _iX;
    var _iY;
    var _iValue;
    var _iType;
    var _iSquareID;
    var _iMovementDifference;    
    var _iEdgeLeft;
    var _iEdgeRight;
    var _iEdgeTop;
    var _iEdgeBottom;
    var _iExcludeCollisionRectangleLimitLeft;
    var _iExcludeCollisionRectangleLimitRight;
    var _iExcludeCollisionRectangleLimitTop;
    var _iExcludeCollisionRectangleLimitBottom;

    var _bFading;
    var _bChecked;
    
    var _aEdges;

    this._init = function(){
        _oMatrixContainer = oMatrixContainer;
        _oSquareContainer = new createjs.Container();
        _oMatrixContainer.addChild(_oSquareContainer);
        
        _oValueText = null;
        _iColumn = iColumn;
        _iRow = iRow;
        _iX = MATRIX_OFFSET_X + (SQUARE_SIZE + SQUARE_OFFSET) * _iColumn;
        _iY = MATRIX_OFFSET_Y;
        _iSquareID = iSquareID;

        _iType = iType;
        _iValue = iValue;
        _iTextOffset = 10;
        _bFading = false;
        _bChecked = false;
        _iMovementDifference = SQUARE_SIZE + SQUARE_OFFSET;

        this.initSquare();
        this.createExcludeCollisionRectangle();
        
        _oSquareContainer.x = _iX;
        _oSquareContainer.y = _iY;                
    };
    
    this.createExcludeCollisionRectangle = function(){
        var iSize = SQUARE_SIZE * 1.5;
        
        _oExcludeSquareCollisionRectangle = new createjs.Shape();
        _oExcludeSquareCollisionRectangle.graphics.beginFill("white");
        _oExcludeSquareCollisionRectangle.graphics.drawRect(0, 0, iSize, iSize);
        _oExcludeSquareCollisionRectangle.graphics.endFill();
        _oExcludeSquareCollisionRectangle.alpha = 0.3;
        _oExcludeSquareCollisionRectangle.x = -1 * iSize/2;
        _oExcludeSquareCollisionRectangle.y = -1 * iSize/2;
        _oExcludeSquareCollisionRectangle.width = iSize;
        _oExcludeSquareCollisionRectangle.height = iSize;
        _oExcludeSquareCollisionRectangle.visible = true;
        _oSquareContainer.addChild(_oExcludeSquareCollisionRectangle);

        this.setExcludeCollisionRectangleLimits();
    };
    
    this.setExcludeCollisionRectangleLimits = function(){
        _iExcludeCollisionRectangleLimitLeft = _oSquareContainer.x + _oExcludeSquareCollisionRectangle.x;
        _iExcludeCollisionRectangleLimitRight = _oSquareContainer.x + _oExcludeSquareCollisionRectangle.x + _oExcludeSquareCollisionRectangle.width;
        _iExcludeCollisionRectangleLimitTop = _oSquareContainer.y + _oExcludeSquareCollisionRectangle.y;
        _iExcludeCollisionRectangleLimitBottom = _oSquareContainer.y + _oExcludeSquareCollisionRectangle.y + _oExcludeSquareCollisionRectangle.height;
    };
    
    this.getLimitLeft = function(){
        return _iExcludeCollisionRectangleLimitLeft;
    };
    
    this.getLimitRight = function(){
        return _iExcludeCollisionRectangleLimitRight;
    };
    
    this.getLimitTop = function(){
        return _iExcludeCollisionRectangleLimitTop;
    };
    
    this.getLimitBottom = function(){
        return _iExcludeCollisionRectangleLimitBottom;
    };
    
    this.initBonusSquare = function(){
        _oBonusSquare = new CBonus(_iType, _iX, _iY, _oSquareContainer);
    };

    this.createEdges = function(){
        var iHeightVar = 1;
        
        _aEdges = [];        
        _iEdgeLeft = this.getX() - SQUARE_SIZE/2;
        _iEdgeRight = this.getX() + SQUARE_SIZE/2;
        _iEdgeTop = this.getY() - SQUARE_SIZE/2;
        _iEdgeBottom = this.getY() + SQUARE_SIZE/2;

        _aEdges[EDGE_LEFT] = new CEdge(_iEdgeLeft, _iEdgeTop, _iEdgeLeft, _iEdgeBottom, iHeightVar, false);
        _aEdges[EDGE_RIGHT] = new CEdge(_iEdgeRight, _iEdgeBottom, _iEdgeRight, _iEdgeTop, iHeightVar, false);
        _aEdges[EDGE_TOP] = new CEdge(_iEdgeRight, _iEdgeTop, _iEdgeLeft, _iEdgeTop, iHeightVar, false);
        _aEdges[EDGE_BOTTOM] = new CEdge(_iEdgeLeft, _iEdgeBottom, _iEdgeRight, _iEdgeBottom, iHeightVar, false);

        this.setExcludeCollisionRectangleLimits();
    };
    
    this.getEdges = function(){
        return _aEdges;
    };
    
    this.initSquare = function(){
        switch(_iType) {
            case REGULAR_SQUARE:    
                var oData = {
                    images: [s_oSpriteLibrary.getSprite('box')],
                    // width, height & registration point of each sprite
                    frames: {width: 100, height: 100, regX: 0, regY: 0},
                    animations: {idle: [0,35]}
                };
                
                var oSpriteSheet = new createjs.SpriteSheet(oData);
                _oSquareSprite = createSprite(oSpriteSheet, 'idle', 0, 0, 100, 100);
                this.setSquareColour();
                _oSquareSprite.regX = _oSquareSprite.regY = SQUARE_SIZE/2;

                _oValueText = new createjs.Text(_iValue, "40px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
                _oValueText.textAlign = "center";
                _oValueText.textBaseline = "alphabetic";
                _oValueText.y = 15;                
                break;      
            case EXTRA_BALL_SQUARE:
                var oSprite = s_oSpriteLibrary.getSprite('ball_bonus');
                _oSquareSprite = createBitmap(oSprite);  
                _oSquareSprite.regX = oSprite.width/2;
                _oSquareSprite.regY = oSprite.height/2;
                
                _oValueText = new createjs.Text("+" + EXTRA_BALLS, "40px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
                _oValueText.textAlign = "center";
                _oValueText.textBaseline = "alphabetic";
                _oValueText.x = -3;
                _oValueText.y = 12;                
                break;
        };

        _oSquareContainer.addChild(_oSquareSprite, _oValueText);
    };
    
    this.setSquareColour = function(){
        var iColour = _iValue-1;
        if (iColour > 11) {
            iColour = 11 - iColour%11;
        };
        _oSquareSprite.gotoAndStop(iColour);
    };
    
    this.squareHitByBall = function(){
        switch (_iType) {
            case REGULAR_SQUARE:
                if (_iValue > 1) {
                    if (soundPlaying("boing") === false) {
                        playSound("boing_wall",1,false);
                    } else {
                        playSound("boing",1,false);
                    };
                    _iValue--;
                    _oValueText.text = _iValue;
                    this.setSquareColour();
                    return false;
                } else {
                    s_oGame.pushSquareToRemove(_iSquareID, _iRow, _iColumn);
                    playSound("explosion",1,false);
                    this.destroySquare();
                    return true;
                };                
            case EXTRA_BALL_SQUARE:
                s_oGame.pushSquareToRemove(_iSquareID, _iRow, _iColumn);
                this.fadeOut();
                this.addBalls();
                return true;
        };
        
        return false;
    };
    
    this.destroySquare = function(){
        _bFading = true;
        this.startParticleEmitter();
        _oSquareSprite.visible = false;
        _oValueText.visible = false;
        createjs.Tween.removeTweens(this.getSquareSprite());        
        this.unload();        
    };
    
    this.destroyEdges = function(){
        if (_aEdges === undefined) {
            return;
        };
        
        for (var i = 0; i < _aEdges.length; i++) {
            _aEdges[i].destroy();
        };
        
        _aEdges = [];
    };
    
    this.lowerSquare = function(){
        var oParent = this;
        
        _oMovementTween = createjs.Tween.get(_oSquareContainer)
            .to({y: _oSquareContainer.y + _iMovementDifference}, 400, createjs.Ease.quadOut)
            .call(function(){
                oParent.onSquareLowerEnd();               
                createjs.Tween.removeTweens(oParent.getSquareContainer());
            });
    };
    
    this.onSquareLowerEnd = function(){
        s_oGame.checkForGameOver();
        this.createEdges();
    };
    
    this.getX = function(){
        return _oSquareContainer.x;
    };
    
    this.getY = function(){
        return _oSquareContainer.y;
    };
    
    this.getRow = function(){
        return _iRow;
    };
    
    this.getColumn = function(){
        return _iColumn;
    };
    
    this.getSize = function(){
        return SQUARE_SIZE;
    };
    
    this.getSquareContainer = function(){
        return _oSquareContainer;
    };
    
    this.getSquareSprite = function(){
        return _oSquareSprite;
    };
    
    this.fadeOut = function(){
        if (_iType === EMPTY_SQUARE) {
            return;
        };
        
        _bFading = true;
        this.startParticleEmitter();
        
        var oParent = this;
        _oFadeTween = createjs.Tween.get(_oSquareContainer)
            .to({alpha: 0}, 200, createjs.Ease.cubicOut)
            .call(function(){
                oParent.unload();
                createjs.Tween.removeTweens(oParent.getSquareSprite());
            });
    };
    
    this.addBalls = function() {
        playSound("bonus_balls",1,false);
        s_oGame.addBalls();
    };
    
    this.startParticleEmitter = function(){
        if (_iType === REGULAR_SQUARE) {
            s_oGame.initParticleEmitter(this.getX(), this.getY(), COLOR_REGULAR_SQUARE);
        } else {
            s_oGame.initParticleEmitter(this.getX(), this.getY(), COLOR_BONUS_SQUARE_BALL);
        };
    };

    this.isBonus = function(){
        switch (_iType) {
            case REGULAR_SQUARE:
                return false;
                break;
            case EXTRA_BALL_SQUARE:
                return true;
                break;
        };
    };
    
    this.getValue = function(){
        return _iValue;
    };
    
    this.getType = function(){
        return _iType;
    };

    this.isFading = function(){
        return _bFading;
    };
    
    this.getID = function(){
        return _iSquareID;
    };
    
    this.unload = function(){
        _oMatrixContainer.removeChild(_oSquareContainer);
    };
    
    this._init();
};

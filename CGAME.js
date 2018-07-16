function CGame(oData) {
    var _bStartGame;
    var _bDisableEvents;
    var _bTurn;
    var _bLaunched;
    var _bPressMove;
    
    var _iTotalScore;
    var _iBalls;
    var _iLines;
    var _iBallLimit;
    var _iBallStopped;
    var _iTimeElapsSkip;
    var _iPhysicsIteration;
    var _iSkipTimer;
    var _iExcludeWallCollisionRectangleLimitLeft;
    var _iExcludeWallCollisionRectangleLimitRight;
    var _iExcludeWallCollisionRectangleLimitTop;
    var _iExcludeWallCollisionRectangleLimitBottom;

    var _oGameContainer;
    var _oInterface;
    var _oEndPanel;
    var _oHelpPanel;  
    var _oSquareMatrix;
    var _oHitArea;
    var _oArrow;
    var _oBallStartPosition;
    var _oClickPoint;
    var _oReleasePoint;
    var _oExcludeWallCollisionRectangle;
    
    var _aBalls;
    var _aWallsEdge;
    var _aParticleEmitters;
    
    var _aSquareToRemove;
    
    this._init = function(){
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);        
        this.resetVariables();
        
        _aSquareToRemove = new Array();
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oGameContainer.addChild(oBg);
        this.initBackgroundWallLimits();
        
        this.initParticleEmitters();
        
        _oSquareMatrix = new CSquareMatrix(_oGameContainer);
        _oSquareMatrix.init();

        _iBallLimit = 1090;
        _oBallStartPosition = {x: CANVAS_WIDTH_HALF, y: _iBallLimit};
        this.initArrow();
        
        _aBalls = new Array;
        this.initBalls();

        this.initExcludeWallCollisionRectangle();
        this.initWallEdges();
        this.initHitArea();
        
        _oInterface = new CInterface();
        _oInterface.initInterfacesText();
        
        _oHelpPanel = CHelpPanel();
        _oSquareMatrix.lowerSquareLine();
    };
    
    this.initParticleEmitters = function(){
        for (var i = 0; i < PARTICLES_EMITTERS_NUMBER; i++) {
            var oParticleEmitter = new CParticleEmitter(0, 0, 0, _oGameContainer);
            _aParticleEmitters.push(oParticleEmitter);
        };
    };
    
    this.initExcludeWallCollisionRectangle = function(){
        var iWidth = CANVAS_WIDTH * 0.65;
        var iHeight = CANVAS_HEIGHT * 0.45;
        
        _oExcludeWallCollisionRectangle = new createjs.Shape();
        _oExcludeWallCollisionRectangle.graphics.beginFill("white");
        _oExcludeWallCollisionRectangle.graphics.drawRect(0, 0, iWidth, iHeight);
        _oExcludeWallCollisionRectangle.graphics.endFill();
        _oExcludeWallCollisionRectangle.alpha = 0.3;
        _oExcludeWallCollisionRectangle.x = 130;
        _oExcludeWallCollisionRectangle.y = 350;
        _oExcludeWallCollisionRectangle.width = iWidth;
        _oExcludeWallCollisionRectangle.height = iHeight;
        _oExcludeWallCollisionRectangle.visible = false;
        _oGameContainer.addChild(_oExcludeWallCollisionRectangle);
        
        _iExcludeWallCollisionRectangleLimitLeft = _oExcludeWallCollisionRectangle.x;
        _iExcludeWallCollisionRectangleLimitRight = _oExcludeWallCollisionRectangle.x + _oExcludeWallCollisionRectangle.width;
        _iExcludeWallCollisionRectangleLimitTop = _oExcludeWallCollisionRectangle.y;
        _iExcludeWallCollisionRectangleLimitBottom = _oExcludeWallCollisionRectangle.y + _oExcludeWallCollisionRectangle.height;
    };

    this.initWallEdges = function(){
        _aWallsEdge = [];
        
        var iHeight = 5;
        var iXVar = 2;
        var iYVarTop = 20;
        //var iYVarBottom = 127;

        var oWallEdgeLeft = new CEdge(LINES_EDGEBOARD_X + iXVar, CANVAS_HEIGHT - iYVarTop, 
            LINES_EDGEBOARD_X + iXVar, iYVarTop, iHeight, false);
        
        var oWallEdgeRight = new CEdge(CANVAS_WIDTH - LINES_EDGEBOARD_X - iXVar, iYVarTop, 
            CANVAS_WIDTH - LINES_EDGEBOARD_X + iXVar, CANVAS_HEIGHT - iYVarTop, iHeight, false);

        var oWallEdgeTop = new CEdge(EDGEBOARD_X - iXVar, LINES_EDGEBOARD_Y + iYVarTop, 
            CANVAS_WIDTH - LINES_EDGEBOARD_X + iXVar, LINES_EDGEBOARD_Y + iYVarTop, iHeight, false);
        /*    
        var oWallEdgeBottom = new CEdge(CANVAS_WIDTH - LINES_EDGEBOARD_X + iXVar, 
            CANVAS_HEIGHT - LINES_EDGEBOARD_Y - iYVarBottom, LINES_EDGEBOARD_X - iXVar, 
            CANVAS_HEIGHT - LINES_EDGEBOARD_Y - iYVarBottom, iHeight, false)
        */
        _aWallsEdge[EDGE_LEFT] = oWallEdgeLeft.getModel();
        _aWallsEdge[EDGE_RIGHT] = oWallEdgeRight.getModel();        
        _aWallsEdge[EDGE_TOP] = oWallEdgeTop.getModel();
        //_aWallsEdge[EDGE_BOTTOM] = oWallEdgeBottom.getModel();        
    };
    
    this.initBackgroundWallLimits = function(){
        var iWallWidth = 655;
        var iWallHeight = 850;
        var iWallThickness = 4;
        var iGameOverThickness = 2;
        var iWallRoundness = 1;
        var iGameOverRoundness = 1;
        var iWallAlpha = 0.8;
        
        var oWall = new createjs.Shape();
        oWall.graphics.beginFill("red");
        oWall.graphics.drawRoundRect(LINES_EDGEBOARD_X-iWallThickness, BOTTOM_LIMIT, iWallWidth, iGameOverThickness, iGameOverRoundness);
        oWall.graphics.endFill();
        oWall.alpha = iWallAlpha;
        _oGameContainer.addChild(oWall);
        
        var oWall = new createjs.Shape();
        oWall.graphics.beginFill("#01adff");
        oWall.graphics.drawRoundRect(LINES_EDGEBOARD_X-iWallThickness, 270, iWallThickness, iWallHeight, iWallRoundness);
        oWall.graphics.endFill();
        oWall.alpha = iWallAlpha;
        _oGameContainer.addChild(oWall);
        
        var oWall = new createjs.Shape();
        oWall.graphics.beginFill("#01adff");
        oWall.graphics.drawRoundRect(CANVAS_WIDTH-LINES_EDGEBOARD_X, 270, iWallThickness, iWallHeight, iWallRoundness);
        oWall.graphics.endFill();
        oWall.alpha = iWallAlpha;
        _oGameContainer.addChild(oWall);
        
        var oWall = new createjs.Shape();
        oWall.graphics.beginFill("#01adff");
        oWall.graphics.drawRoundRect(LINES_EDGEBOARD_X-iWallThickness, LINES_EDGEBOARD_Y+20, iWallWidth, iWallThickness, iWallRoundness);
        oWall.graphics.endFill();
        oWall.alpha = iWallAlpha;
        _oGameContainer.addChild(oWall);         
    };

    this.resetVariables = function(){
        _oEndPanel = null;
        
        _bStartGame = false;
        _bDisableEvents = false;
        _bTurn = false;
        _bLaunched = false;
        _bPressMove = false;
        s_bSkipFunction = false;
        
        _iPhysicsIteration = PHYSICS_ITERATIONS;
        _iLines = 0;
        _iSkipTimer = 0;
        _iTimeElapsSkip = 0;
        _iBallStopped = 0;
        _iBalls = STARTING_BALLS;
        _iTotalScore = s_iTotalScore;
        _oReleasePoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
        
        _aParticleEmitters = [];

        setVolume("soundtrack", 0.5);
    };
    
    this.initBalls = function(){
        for (var i = 0; i < _iBalls; i++) {
            var oBall = new CBall(i, _oGameContainer);
            _aBalls.push(oBall);
        };
    };
    
    this.initArrow = function(){
        _oArrow = new CArrow(_oBallStartPosition.x, _oBallStartPosition.y, _oGameContainer);
        _oArrow.setVisible(false);
    };
    
    this.getBallStartPosition = function(){
        return _oBallStartPosition;
    };
    
    this.initHitArea = function(){
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        
        _oHitArea.on("mousedown", function(evt) { s_oGame.onPressDown(evt); });
        _oHitArea.on("pressmove", function(evt) { s_oGame.onPressMove(evt); });
        _oHitArea.on("pressup", function() { s_oGame.onPressUp(); });
        
        this.setHitAreaCursor();
        _oGameContainer.addChild(_oHitArea);
    };
    
    this.setHitAreaCursor = function(){
        if (!s_bMobile) {
            if (!_bLaunched) {
                _oHitArea.cursor = "pointer";
            } else {
                _oHitArea.cursor = "arrow";
            };
        };
    };

    this.checkForGameOver = function(){
        var aSquareArray = _oSquareMatrix.getSquareArray();
        var iBottomLimit = BOTTOM_LIMIT - SQUARE_SIZE;
        
        for (var i = 0; i < aSquareArray.length; i++) {
            var oSquare = aSquareArray[i];
            // FADE OUT THE SQUARES OVER THE LIMIT
            if (oSquare.getY() >= iBottomLimit) {
                oSquare.fadeOut();
                // IF IT'S A REGULAR SQUARE, IT'S GAMEOVER
                if (oSquare.getType() === REGULAR_SQUARE) {
                    this.gameOver();
                };
            };
        };
    };
    
    this.onPressDown = function (evt) {
        if (_bLaunched) {
            return;
        }
        
        _oClickPoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
        _oArrow.setVisible(true);
        _oArrow.setPosition(_aBalls[0].getX(), _aBalls[0].getY());
        this.arrowUpdate();
    };

    this.onPressMove = function (evt) {
        if (_bLaunched) {
            return;
        }
        
        _oReleasePoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
        this.arrowUpdate();
        _bPressMove = true;
    };
    
    this.onPressUp = function () {
        _oArrow.setVisible(false);
        
        if (!_bPressMove || _bLaunched) {
            return;
        }

        this.launchBallOnClick();
        _bPressMove = false;
    };
    
    this.rotateArrow = function () {
        console.log('xxxx')
        if (_bLaunched) {
            return;
        };
        
        var oDif = {x: _oClickPoint.x - _oReleasePoint.x, y: _oClickPoint.y - _oReleasePoint.y};
        var iAngle = Math.atan2(oDif.y, oDif.x);
        var iAngleTran = iAngle * (180 / Math.PI) + OFFSET_ANGLE_ARROW;
        _oArrow.setAngle(iAngleTran);
    };
    
    this.arrowUpdate = function () {
        this.rotateArrow();
    };
    
    this.launchBallOnClick = function(){
        _oBallStartPosition = {x: 0, y: 0};     // RESET THE BALL START POSITION, FOR NEXT TURN
        var vClick = new CVector2(_oClickPoint.x - _oReleasePoint.x, _oClickPoint.y - _oReleasePoint.y);
        if (_oClickPoint.y - _oReleasePoint.y > 0) {
            // AVOID LAUNCH BELOW THE BALL Y
            vClick.set(_oClickPoint.x - _oReleasePoint.x, -1);
        };
        vClick.normalize();        
        
        for (var i = 0; i < _aBalls.length; i++) {            
            this.launchBall(_aBalls[i], i, vClick);
        };
        
        
        _oReleasePoint.x = 0;
        _oReleasePoint.y = 0;
        _iTimeElapsSkip = 0;
        this.setLaunched(true);
    };
    
    this.getBallPosition = function(){
        var oPos = {x: _aBalls[0].getX(), y: _aBalls[0].getY()};
        return oPos;
    };
    
    this.launchBall = function(oBall, iBallN, vLaunch){
        var iDelayTime = BALL_LAUNCH_INTERVAL * iBallN;
        var vBallCurForce = oBall.vCurForce();
        var vDirection = new CVector2(vLaunch.getX(), vLaunch.getY());
        
        var iBalls = this.getBallsNumber();
        setTimeout(function () {                    // ADD A LITTLE DELAY TO EACH LAUNCH
            var iRemainingBalls = iBalls - (iBallN+1);
            _oInterface.refreshBallsText(iRemainingBalls);
            vDirection.scalarProduct(LAUNCH_POWER_LIMIT_MIN);         // ADD A FORCE MODULE TO MOVE THE BALL
            vBallCurForce.setV(vDirection);            // SET THE BALL FORCE TO THE VECTOR WE CREATED
            
            if (iRemainingBalls === 0) {
                _oInterface.setBallsTextVisible(false);
            };
        }, iDelayTime);
    };
    
    this.getBallsNumber = function(){
        return _iBalls;
    };
    
    this.setBallStartPosition = function(iX){
        _oBallStartPosition = {x: iX, y: _iBallLimit};
    };
    
    this.setLaunched = function(bValue){
        _bLaunched = bValue;
    };
        
    this.getLinesNumber = function(){
        return _iLines;
    };
    
    this.addBalls = function(){
        _iBalls += EXTRA_BALLS;        
    };
    
    this.addLine = function(){
        _iLines++;
        _oInterface.refreshLinesText(_iLines);
    };

    this.resetBalls = function(){
        s_bSkipFunction = false;
        _iSkipTimer = 0;
        _oInterface.disableSkipButton();
        _oSquareMatrix.lowerSquareLine(); 
        _bLaunched = false;
        _bTurn = false;

        // CREATE NEW BALLS, IF NEEDED
        var iBalls = (_iBalls - _aBalls.length);        
        if (iBalls > 0) {
            for (var i = 0; i < iBalls; i++) {
                var iID = i + _aBalls.length + 1;
                var oBall = new CBall(iID, _oGameContainer);
                _aBalls.push(oBall);
            };
        };
        
        // RESET POSITION OF EVERY BALL
        for (var i = 0; i < _aBalls.length; i++) {
            _aBalls[i].resetBallPosition(_oBallStartPosition.x, _iBallLimit);            
        };
        
        _iBallStopped = 0;
        _bTurn = true;
    };  
    
    this.unload = function(){
        _oInterface.unload();
        _oSquareMatrix.unload();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();        
        s_oGame = null;
    };
    
    this.onExit = function(){
        setVolume("soundtrack", 1);
        s_oGame.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };

    this.restart = function(){
        setVolume("soundtrack", 0.3);
        $(s_oMain).trigger("restart_level");
        s_oGame.unload();
        s_oMain.gotoGame();
    };

    this._onExitHelp = function(){
        _bStartGame = true;
        this.setTurn(true);
    };
    
    this.updateScore = function(){
        // UPDATE TOTAL SCORE
        _iTotalScore += _iLines;
        s_iTotalScore = _iTotalScore;
        saveItem("bouncingballs_total_score", s_iTotalScore);

        // UPDATE BEST SCORE
        if (_iLines > s_iBestScore) {
            s_iBestScore = _iLines;
            saveItem("bouncingballs_best_score", s_iBestScore);
        };
    };

    this.gameOver = function(){
        _bStartGame = false;
        
        this.updateScore();        
        
        if(_oEndPanel === null){
            playSound("game_over",1,false);
            stopSound("soundtrack");
            
            setTimeout(function(){ 
                playSound("soundtrack",0.5,false); 
            }, 3000);
            
            _oEndPanel = new CEndPanel(_iLines);
            _bDisableEvents = true;
            
            $(s_oMain).trigger("share_event", s_iTotalScore);
            $(s_oMain).trigger("save_score", s_iTotalScore);
        };
    };

    this.setTurn = function(bValue){
        _bTurn = bValue;
    };

    this.checkPointIsInRectApprossimate = function(oBall){
        // IF THE BALL IS INSIDE THE RECTANGLE, RETURN TRUE
        if (oBall.getX() > _iExcludeWallCollisionRectangleLimitLeft && 
            oBall.getX() < _iExcludeWallCollisionRectangleLimitRight &&
            oBall.getY() > _iExcludeWallCollisionRectangleLimitTop /*&& 
            oBall.getY() < _iExcludeWallCollisionRectangleLimitBottom*/ ) {
            return true;
        // IF THE BALL IS NOT INSIDE THE RECTANGLE, RETURN FALSE
        } else {
            return false;
        };
    };
    
    this.checkPointIsInRectSquaresApprossimate = function(oBall, oSquare){
        // IF THE BALL IS INSIDE THE RECTANGLE, RETURN TRUE
        if (oBall.getX() > oSquare.getLimitLeft() && 
            oBall.getX() < oSquare.getLimitRight() &&
            oBall.getY() > oSquare.getLimitTop() && 
            oBall.getY() < oSquare.getLimitBottom() ) {
            return true;
        // IF THE BALL IS NOT INSIDE THE RECTANGLE, RETURN FALSE
        } else {
            return false;
        };
    };

    this.moveBall = function(oBall){
        // IF THE BALL IS ALREADY STOPPED, SKIP
        if (oBall.isStopped() === true) {
            return;
        };

        oBall.vPos().addV(oBall.vCurForce());  // MOVE EACH BALL WITH ITS FORCE MODULE
        
        this.checkCollisionWithWalls(oBall, _aWallsEdge);
        this.checkCollisionWithSquares(oBall);
        
        oBall.updateSpritePosition();
    };
    
    this.checkCollisionWithWalls = function(oBall, aEdges){
        // IF THE BALL IS OUT OF THE WALL, CHECK IF THERE IS COLLISION WITH WALLS
        if ( this.checkPointIsInRectApprossimate(oBall) === false ) {
            // CHECK FOR COLLISIONS                
            for (var i = 0; i < aEdges.length; i++) {            
                var oInfo = collideEdgeWithCircle(aEdges[i], oBall.vPos(), oBall.getRadius());

                // IF THERE'S A COLLISION, FOR ALL WALLS BUT THE BOTTOM
                if (oInfo){                    
                    this.reflectBallOnWall(oBall, aEdges[i], oInfo);
                    return true;
                };
            };        
        };
        // IF THERE'S NO COLLISION
        return false;
    };
    
    this.reflectBallOnWall = function(oBall, oEdge, oInfo){
        if (soundPlaying("boing_wall") === false) {
            playSound("boing_wall",1,false);
        } else {
            playSound("boing",1,false);
        };
        this.bounceBallOnEdge(oInfo, oEdge, oBall);
    };
    
    this.stopBallOnBottomWall = function(oBall){
        _iBallStopped++;
        oBall.stopBall();        
    };

    this.checkCollisionWithSquares = function(oBall){
        var aSquareArray = _oSquareMatrix.getSquareArray();

        if ( oBall.vCurForce().getY() < 0 ){
            // LOOP THRU ALL THE SQUARES TO CHECK FOR ANY COLLISION
            for (var i = 0; i < aSquareArray.length; i++) {
                // CHECK IF THE BALL IS NEAR THE SQUARE
                if ( this.checkPointIsInRectSquaresApprossimate(oBall, aSquareArray[i]) === true ) {
                    // CHECK COLLISION WITH SQUARES' EDGES
                    this.reflectBallOnSquare(oBall, aSquareArray[i].getEdges(), aSquareArray[i]);
                };
            };  
        }else{
            // LOOP THRU ALL THE SQUARES TO CHECK FOR ANY COLLISION
            for (var i = aSquareArray.length-1; i >-1; i--) {
                // CHECK IF THE BALL IS NEAR THE SQUARE
                if ( this.checkPointIsInRectSquaresApprossimate(oBall, aSquareArray[i]) === true ) {
                    // CHECK COLLISION WITH SQUARES' EDGES
                    this.reflectBallOnSquare(oBall, aSquareArray[i].getEdges(), aSquareArray[i]);
                };
            };
        }

        // IF THERE'S NO COLLISION
        return false;
    };
    
    this.pushSquareToRemove = function(iID, iRow, iColumn){
        _aSquareToRemove.push({ iID: iID, iRow : iRow, iColumn : iColumn });
    };

    this.removeSquareFromMatrix = function(iID, iRow, iColumn){
        _oSquareMatrix.removeSquare(iID, iRow, iColumn);
    };

    this.reflectBallOnSquare = function(oBall, aEdges, oSquare){
        var bCollide = false;
        var iX = oBall.getX();
        var iY = oBall.getY();
        
        var oLeft   = aEdges[EDGE_LEFT].getModel();
        var oRight  = aEdges[EDGE_RIGHT].getModel();
        var oTop    = aEdges[EDGE_TOP].getModel();
        var oBottom = aEdges[EDGE_BOTTOM].getModel();
        
        var aAngleEdges   = _oSquareMatrix.getAngleEdges();
        var aSquareMatrix = _oSquareMatrix.getSquareMatrix();    // GLOBAL SQUARE MATRIX
        var iSquareRow    = oSquare.getRow();
        var iSquareColumn = oSquare.getColumn();
        
        var bLeftSquare     = false;
        var bRightSquare    = false;        
        var bBottomSquare   = false;
        var bTopSquare      = false;        
        var bTopLeftSquare  = false;
        var bBottomLeftSquare  = false;        
        var bTopRightSquare = false;
        var bBottomRightSquare = false;        
        
        if( iSquareColumn-1 > -1 && aSquareMatrix[iSquareRow][iSquareColumn-1] !== null){
            bLeftSquare = true;
        }
        if( iSquareRow-1 > -1 && aSquareMatrix[iSquareRow-1][iSquareColumn] !== null){
            bBottomSquare = true;
        }        
        if( iSquareRow+1 < aSquareMatrix.length && aSquareMatrix[iSquareRow+1][iSquareColumn] !== null){
            bTopSquare = true;
        }
        if( iSquareColumn+1 < SQUARE_LINE_NUMBER && aSquareMatrix[iSquareRow][iSquareColumn+1] !== null){
            bRightSquare = true;
        }        
        if( iSquareRow+1 < aSquareMatrix.length && iSquareColumn-1 > -1 && aSquareMatrix[iSquareRow+1][iSquareColumn-1] !== null){
            bTopLeftSquare = true;
        }
        if( iSquareRow-1 > -1 && iSquareColumn-1 > -1 && aSquareMatrix[iSquareRow-1][iSquareColumn-1] !== null){
            bBottomLeftSquare = true;
        }        
        if( iSquareRow+1 < aSquareMatrix.length && iSquareColumn+1 < SQUARE_LINE_NUMBER && aSquareMatrix[iSquareRow+1][iSquareColumn+1] !== null){
            bTopRightSquare = true;
        }
        if( iSquareRow-1 > -1 && iSquareColumn+1 < SQUARE_LINE_NUMBER && aSquareMatrix[iSquareRow-1][iSquareColumn+1] !== null){
            bBottomRightSquare = true;
        }      
               
        if ( iY > oSquare.getY() ){ // COMING FROM BOTTOM
            if (iX < oSquare.getX() && bLeftSquare === false && bBottomSquare === false && bBottomLeftSquare === false && oSquare.getColumn() > 0 ) {  // COMING FROM LEFT
                bCollide = this.bounceBallOnAngle(oBall, oBottom.getPointA(), aAngleEdges[EDGE_BOTTOM_LEFT], oBottom, oSquare);
            } else if ( bBottomSquare === false && bRightSquare === false && bBottomRightSquare === false && oSquare.getColumn() < SQUARE_LINE_NUMBER-1 ) {                // COMING FROM RIGHT
                bCollide = this.bounceBallOnAngle(oBall, oBottom.getPointB(), aAngleEdges[EDGE_BOTTOM_RIGHT], oBottom, oSquare);
            };
            
            if (bCollide === false) {   
                

                if( iY > oBottom.getPointA().getY() && bBottomSquare === false ){
                    bCollide = this.__reflectBallOnEdge(oBall, oBottom, oSquare);
                }else if( iX < oBottom.getPointA().getX() && bLeftSquare === false ){
                    bCollide = this.__reflectBallOnEdge(oBall, oLeft, oSquare);    
                }else if( iX > oBottom.getPointB().getX() && bRightSquare === false ){
                    bCollide = this.__reflectBallOnEdge(oBall, oRight, oSquare);    
                }
            }
        } else { // COMING FROM TOP
            if (iX < oSquare.getX() && bTopSquare === false && bTopLeftSquare === false && bLeftSquare === false  && oSquare.getColumn() > 0 ) {  // COMING FROM LEFT
                bCollide = this.bounceBallOnAngle(oBall, oTop.getPointB(), aAngleEdges[EDGE_TOP_LEFT], oTop, oSquare);
            } else if ( bTopSquare === false && bTopRightSquare === false && bRightSquare === false && oSquare.getColumn() < SQUARE_LINE_NUMBER-1 ) {                // COMING FROM RIGHT
                bCollide = this.bounceBallOnAngle(oBall, oTop.getPointA(), aAngleEdges[EDGE_TOP_RIGHT], oTop, oSquare);
            };
            
            if (bCollide === false) {                
                if( iY < oTop.getPointA().getY() && bTopSquare === false ){
                    bCollide = this.__reflectBallOnEdge(oBall, oTop, oSquare);
                }else if( iX < oBottom.getPointA().getX() && bLeftSquare === false ){
                    bCollide = this.__reflectBallOnEdge(oBall, oLeft, oSquare);    
                }else if( iX > oBottom.getPointB().getX() && bRightSquare === false ){
                    bCollide = this.__reflectBallOnEdge(oBall, oRight, oSquare);    
                }              
            }
        }

        if( bCollide === true ){
            if (oSquare.isFading() === false) {
                oSquare.squareHitByBall();
            };
        }

        return bCollide;
    };
    
    this.bounceBallOnAngle = function(oBall, vCollisionPoint, vAngleNormal, oEdge, oSquare){
     
        var iSquareDistance = distanceV2WithoutSquareRoot(oBall.vPos(), vCollisionPoint);
        
        if (iSquareDistance < oBall.getSquareRadiusForCollisionAngles()){
            // FOR NORMAL SQUARES ONLY, BOUNCE BACK
            if (oSquare.isBonus() === false) {   

                // check angle between ball and angle
                var angle = toDegree(vAngleNormal.angleBetweenVectors(oBall.vCurForce()));
                
                if( angle < COLLISION_ANGLE_MIN){
                    return false;
                }
                
                var vNewPosition = new CVector2();
                vNewPosition.setV(vAngleNormal);
                vNewPosition.scalarProduct(oBall.getRadiusWithTolerance());
                vNewPosition.addV(vCollisionPoint);
                oBall.setPos(vNewPosition);

                reflectVectorV2(oBall.vCurForce(), vAngleNormal);
            };
            
            return true;
        } else {
            // NO COLLISION
            return false;
        }
    };
    
    this.__reflectBallOnEdge = function( oBall, oEdgeModel, oSquare ){
        //  CHECK FOR COLLISIONS
        var oInfo = collideEdgeWithCircle(oEdgeModel, oBall.vPos(), oBall.getRadius() );
        if (oInfo){
            // FOR NORMAL SQUARES ONLY, BOUNCE BACK
            if (oSquare.isBonus() === false) {
                this.bounceBallOnEdge(oInfo, oEdgeModel, oBall);                
            };
            
            return true;
        }

        return false;
    };

    this.bounceBallOnEdge = function(oInfo, oEdgeModel, oBall){
        var vNewPos = new CVector2();
        vNewPos.setV(oEdgeModel.getNormal());                   // CREATE THE EDGE NORMAL, CHECK FOR ALL THE DISTANCE TO FIND THE COLLISION POINT
        vNewPos.scalarProduct(oBall.getRadiusWithTolerance());
        vNewPos.addV(oInfo.closest_point);                      // FIND THE NEAREST POINT OUT OF THE EDGE TO THE COLLISION POINT
        oBall.setPos(vNewPos);                          // SET THE BALL ON THE COLLISION POSITION (MINUS A LITTLE EDGE)
        
        reflectVectorV2(oBall.vCurForce(), oEdgeModel.getNormal()); // REFLECT THE BALL
    };

    this.setStartGame = function(bValue){
        _bStartGame = bValue;
    };

    this.initParticleEmitter = function(iX, iY, iColor){
        for (var i = 0; i < _aParticleEmitters.length; i++){
            if (_aParticleEmitters[i].isActive() === false) {
                _aParticleEmitters[i].start(iX, iY, iColor);
                break;
            };
        };
    };
    
    this.skipFunction = function(){
        if (s_bSkipFunction) {
            _iPhysicsIteration = PHYSICS_ITERATIONS * 5;
        } else {
            _iPhysicsIteration = PHYSICS_ITERATIONS;
        };
    };

    this.update = function(){
        if (_bLaunched === true && s_bSkipFunction === false) {
            // TIMER TO SHOW THE "SKIP" BUTTON;
            _iSkipTimer += s_iTimeElaps;
            if (_iSkipTimer > SKIP_TIMER_TIME) {
                _iSkipTimer = 0;
                _oInterface.enableSkipButton();
            };
        };
        
        // LOOP FOR N TIMES IN EACH FPS        
        for (var i = 0; i < _iPhysicsIteration; i++) {
            if (_bStartGame === false || _bTurn === false || _bLaunched === false) {
                _oInterface.resetBallText(_iBalls);
                return;
            }

            // UPDATE BALLS MOVEMENTS WHEN THE PLAYER HAS LAUNCHED. MOVE EACH BALL AND CHECK FOR COLLISIONS
            for (var j = 0; j < _aBalls.length; j++) {            
                var oBall = _aBalls[j];
                this.moveBall(oBall);
                
                // ON BOTTOM WALL COLLISION, STOP THE BALL AND CHECK FOR NEXT TURN
                if (oBall.getY() > _iBallLimit){
                    this.stopBallOnBottomWall(oBall);
                    oBall.resetBallPosition(_oBallStartPosition.x, _iBallLimit);
                    return;
                };                
            }            

            for( var k = 0; k < _aSquareToRemove.length; k++ ){
                this.removeSquareFromMatrix( _aSquareToRemove[k].iID, _aSquareToRemove[k].iRow, _aSquareToRemove[k].iColumn );
            }
            _aSquareToRemove = [];            

            if (_iBallStopped === _aBalls.length) {
                this.resetBalls();
                _oInterface.resetBallText(_iBalls);
            };
        };

        // UPDATE PARTICLE EXPLOSIONS IF THERE IS ANY
        for (var i = 0; i < _aParticleEmitters.length; i++) {
            _aParticleEmitters[i].update();
        };
    };

    s_oGame = this;

    this._init();
}

var s_oGame;

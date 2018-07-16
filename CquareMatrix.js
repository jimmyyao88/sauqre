function CSquareMatrix(oGameContainer){
    var _oMatrixContainer;
    
    var _aSquareArray;
    var _aAngleEdges;
    var _aSquareMatrix;
    
    var _iSquareID;

    this.init = function(){
        _oMatrixContainer = new createjs.Container();
        oGameContainer.addChild(_oMatrixContainer);

        _iSquareID = 0;
        _aSquareArray = new Array;
        _aSquareMatrix = new Array;
        this.createAngleEdges();
    };
    
    this.createSquareLine = function(){
        var aSquareRow = [];
        var iLines = s_oGame.getLinesNumber();
        var iMin = Math.floor(iLines*0.5) + 1;
        var iMax = Math.floor(iLines*1.5);
        var iValue = 0;
        var aTypes = [];
        // TYPE OF SQUARE (EMPTY / REGULAR / EXTRA BALL)
        var aRandomSquarePercentage = [EMPTY_SQUARE,REGULAR_SQUARE];
        var iEmptySquares = 0;
        
        // AT EACH LINE THERE MUST BE AN EXTRA BALL BONUS        
        aTypes.push(EXTRA_BALL_SQUARE);
        
        for (var i = 0; i < SQUARE_LINE_NUMBER-1; i++) {
            var iType = aRandomSquarePercentage[Math.floor(Math.random() * aRandomSquarePercentage.length)];
            
            if (iType === EMPTY_SQUARE) {
                iEmptySquares++;
                
                //AVOID AN EMPTY LINE
                if (iEmptySquares === SQUARE_LINE_NUMBER-1) {
                    iType = REGULAR_SQUARE;
                };
            };
            aTypes.push(iType);
        };
        
        // RANDOMIZE THE TYPES ARRAY
        shuffle(aTypes);
        
        for (var c = 0; c < aTypes.length; c++) {
            switch(aTypes[c]) {
                case EMPTY_SQUARE: {
                    aSquareRow.push(null);
                } break;
                case REGULAR_SQUARE: {
                    iValue = Math.floor((Math.random() * iMax) + iMin);        
                    var oSquare = new CSquare(_aSquareMatrix.length, c, aTypes[c], iValue, _oMatrixContainer, _iSquareID);
                    oSquare.createEdges();
                    _aSquareArray.push(oSquare);                          
                    _iSquareID++;
                    aSquareRow.push(oSquare);
                } break;
                case EXTRA_BALL_SQUARE: {
                    var oSquare = new CSquare(_aSquareMatrix.length, c, aTypes[c], iValue, _oMatrixContainer, _iSquareID);
                    oSquare.createEdges();
                    _aSquareArray.push(oSquare);                          
                    _iSquareID++;
                    aSquareRow.push(oSquare);
                } break;                
            };
        };
        
        _aSquareMatrix.push(aSquareRow);
    };
    
    this.createAngleEdges = function(){
        _aAngleEdges = [];
        
        _aAngleEdges[EDGE_TOP_LEFT] = new CVector2(-1,-1);
        _aAngleEdges[EDGE_TOP_RIGHT] = new CVector2(1,-1);
        _aAngleEdges[EDGE_BOTTOM_LEFT] = new CVector2(-1,1);
        _aAngleEdges[EDGE_BOTTOM_RIGHT] = new CVector2(1,1);
        
        for (var i = 0; i < _aAngleEdges.length; i++) {
            _aAngleEdges[i].normalize();
        };
    };

    this.getAngleEdges = function(){
        return _aAngleEdges;
    };
    
    this.getSquareArray = function(){
        return _aSquareArray;
    };
    
    this.getSquareMatrix = function(){
        return _aSquareMatrix;
    };
    
    this.lowerSquareLine = function(){
        // CREATE A NEW LINE AND MOVE DOWN THE WHOLE MATRIX
        this.createSquareLine();        

        for (var i = 0; i < _aSquareArray.length; i++) {
            var oSquare = _aSquareArray[i];
            oSquare.destroyEdges();
            oSquare.lowerSquare();
        };
        
        s_oGame.addLine();
    };
    
    this.removeSquare = function(iID, iRow, iColumn){
        for (var i = 0; i < _aSquareArray.length; i++) {
            if ( iID === _aSquareArray[i].getID() ){
                _aSquareArray.splice(i, 1);
                break;
            };
        };
        _aSquareMatrix[iRow][iColumn] = null;
    };
    
    this.unload = function(){
        // UNLOAD ALL LINES
        for (var i = 0; i < _aSquareArray.length; i++) {
            _aSquareArray[i].unload();
            _aSquareArray.splice(i, 1);
        };
        
        _oMatrixContainer.removeAllChildren();
        
        // RECREATE FIRST LINE
        this.createSquareLine();
    };
};

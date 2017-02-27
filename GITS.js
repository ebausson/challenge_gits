var FM, LM, TM, BM;


FM = function() {
    var factoryCount = parseInt(readline());
    var factories = [];


    // getters
    getFactoryCount = function() {
        return factoryCount;
    }
    getFactories = function(filters, sortFunctions, data) {
        var fArray = factories;
        if (!!filters) {
            filters.forEach(function(e){
                fArray = e(fArray, data);
            });
        }
        if( !! sortFunctions) {
            sortFunctions.forEach(function(e){
                fArray = e(fArray, data);
            });
        }
        return fArray;
    }
    printStatus = function() {
        printErr('Factory Count:' + factoryCount);
        for (var i =0; i<factories.length;i++) {
            var factory = factories[i];
            printErr('Factory:' + i + '; cyborgs:' + factory.cyborg + '; owner:' + factory.owner + '; production:' + factory.production);
        }
    }


    //filters
    oFactoriesFilter = function(fArray) {
        return fArray.filter(function(element){return element.owner === 1;})
    }
    noFactoriesFilter = function(fArray) {
        return fArray.filter(function(element){return element.owner !== 1;})
    }
    nFactoriesFilter = function(fArray) {
        return fArray.filter(function(element){return element.owner === 0;})
    }
    eFactoriesFilter = function(fArray) {
        return fArray.filter(function(element){return element.owner === -1;})
    }
    hasProductionFilter = function(fArray) {
        return fArray.filter(function(element){return element.production > 0;})
    }


    //sorters
    distanceFromRefSort = function(fArray, data) {
        var o = data.referential;
        return fArray.sort(function(fA, fB) {
            var distanceA = LM.getLinkDistance(o.id, fA.id);
            var distanceB = LM.getLinkDistance(o.id, fB.id);
            return distanceA - distanceB;
        });
    }
    byValueSort = function(fArray, data) {
        var o = data.referential;
        return fArray.sort(function(fA, fB) {
            var distanceA = LM.getLinkDistance(o.id, fA.id);
            var distanceB = LM.getLinkDistance(o.id, fB.id);
            var value = distanceA - distanceB;

            value += fA.production * (fA.owner < 0 ? 2 : 1);
            value -= (fA.owner === 0) ? fA.cyborg : 0;

            value -= fB.production * (fB.owner < 0 ? 2 : 1);
            value += (fB.owner === 0) ? fB.cyborg : 0;

            return value;
        });
    }


    // setters
    updateFactory = function(factoryID, ownerID, count, prod) {
        factories[factoryID] = {
            id: factoryID,
            cyborg: count,
            owner: ownerID,
            production: prod
        }
    }



    return {
        getFactoryCount : getFactoryCount,
        getFactories : getFactories,
        updateFactory : updateFactory,
        printStatus: printStatus,

        ownFactoriesFilter : oFactoriesFilter,
        notFactoriesFilter : noFactoriesFilter,
        neutralFactoriesFilter : nFactoriesFilter,
        enemyFactoriesFilter : eFactoriesFilter,
        hasProductionFilter : hasProductionFilter,

        distanceFromRefSort : distanceFromRefSort
    }
}();


LM = function() {
    var linkCount = parseInt(readline());
    var linkList=[];
    var links={};

    for (var i = 0; i < linkCount; i++) {
        var inputs = readline().split(' ');
        var factory1 = parseInt(inputs[0]);
        var factory2 = parseInt(inputs[1]);
        var distance = parseInt(inputs[2]);

        var linkName = 'f' + Math.min(factory1, factory2) + 'f' + Math.max(factory1, factory2);
        links[linkName] = distance;
        linkList[linkList.length] = linkName;

    }


    // getters
    getLinkCount = function() {
        return linkCount;
    }
    getLinkDistance = function(factory1, factory2) {
        return links['f' + Math.min(factory1, factory2) + 'f' + Math.max(factory1, factory2)];
    }
    printStatus = function() {
        printErr('Link Count:' + linkCount);
        for (var i =0; i<linkList.length;i++) {
            var factory = links[linkList[i]];
            printErr('Factory:' + i + '; cyborgs:' + factory.cyborg + '; owner:' + factory.owner + '; production:' + factory.production);
        }
    }

    // setters
    // No update to links possible.


    return {
        getLinkCount : getLinkCount,
        getLinkDistance : getLinkDistance,
        printStatus: printStatus
    }
}();


TM = function(){
    var troops;

    // getters
    printStatus = function() {

    }


    // setters
    clearTroops = function() {
        troops = [];
    }
    updateTroops = function(troopID, ownerID, origin, dest, count, distance) {
        troops[troopID] = {
            id: troopID,
            owner: ownerID,
            origin : origin,
            destination : dest,
            cyborg: count,
            production: prod
        }
    }



    clearTroops(); // initialization;
    return {
        updateTroops : updateTroops,
        clearTroops : clearTroops,
        printStatus: printStatus
    }
}();


BM = function(){
    var bombs;

    // getters
    printStatus = function() {

    }


    // setters
    clearBombs = function() {
        bombs = [];
    }
    updateBombs = function(bombID, ownerID, origin, dest) {
        troops[troopID] = {
            id: troopID,
            owner: ownerID,
            origin : origin,
            destination : dest,
            cyborg: count,
            production: prod
        }
    }



    clearTroops(); // initialization;
    return {
        updateTroops : updateTroops,
        clearBombs : clearBombs,
        printStatus: printStatus
    }
}();


// game loop
var turn=0;
while (true) {
    TM.clearTroops();
    var troopID = 0;

    // Data update.
    var entityCount = parseInt(readline()); // the number of entities (e.g. factories and troops)
    for (var i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        var entityId = parseInt(inputs[0]);
        var entityType = inputs[1];

        if (entityType === 'FACTORY') {
            var owner = parseInt(inputs[2]);
            var count = parseInt(inputs[3]);
            var prod = parseInt(inputs[4]);
            FM.updateFactory(entityId, owner, count, prod);

        } else if (entityType === 'TROOP') {
            var owner = parseInt(inputs[2]);
            var origin = parseInt(inputs[3]); // knowing where a troop left from is useless at the moment.
            var destination = parseInt(inputs[4]);
            var count = parseInt(inputs[5]);
            var distance = parseInt(inputs[6]);
            TM.updateTroops(troopID, owner, origin, destination, count, distance);
            troopID++;
        } else if (entityType === 'BOMB') {
            printErr(inputs);
        }
    }

   if (true) {
        FM.printStatus();
        TM.printStatus();
    }


    //TODO: determine known state for the next 15 turns.

    //starting action determination;
    var actions=[];

    // determining best origin factory.
    var ownFactories = FM.getFactories([FM.ownFactoriesFilter]);

    //targetting neutral first by default.
    var targetType = 'N';
    var possibleDestination = FM.getFactories([FM.neutralFactoriesFilter]);
    if (possibleDestination.length === 0) {
        possibleDestination = FM.getFactories([FM.enemyFactoriesFilter]);
        targetType = 'E';
    }

    for (var i = 0; i< ownFactories.length; i++) {
        var originFactory = ownFactories[i];

        //determining target.
        destinationFactory = FM.distanceFromRefSort(possibleDestination, {'referential':originFactory});

        // looping on possible destinations.
        for (j=0; j<destinationFactory.length && originFactory.cyborg > 3; j++){
            var target = destinationFactory[j];
            var distance = LM.getLinkDistance(originFactory.id, target.id);
            // selecting amount of moved troops.
            if (targetType === 'N') {
                var amount = Math.min(target.cyborg+2, originFactory.cyborg-3);
                if (amount > target.cyborg) {
                    actions[actions.length] = ['MOVE', originFactory.id, target.id, amount].join(' ');
                    originFactory.production = originFactory.production - amount;
                }
            } else {
                var targetWhenArriving = target.cyborg + target.production * distance;
                var amount = Math.min(targetWhenArriving + 2, originFactory.cyborg-4);
                if (amount > target.cyborg) {
                    actions[actions.length] = ['MOVE', originFactory.id, target.id, amount].join(' ');
                    originFactory.production = originFactory.production - amount;
                }
            }
        }
    }

    // Bomb managemeent.
    if (turn === 0 || turn === 5) {
        var originFactory = FM.getFactories([FM.ownFactoriesFilter])[0];
        var targetFactory = FM.getFactories([FM.enemyFactoriesFilter])[0];
        actions[actions.length] = ['BOMB', originFactory.id, targetFactory.id].join(' ');
    }

    //writing order.
    actions[actions.length] = 'WAIT';
    print(actions.join(';'));

    turn++;
}
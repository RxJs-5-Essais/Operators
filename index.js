let fMain=function() {
     oTests1.init();

     oTests1.range();
     oTests1.of();
     oTests1.from(); //Possiblement ASYNCHRONE si test avec une Promise (cf. code)
     //oTests1.interval_timer(); //ASYNCHRONE
     oTests1.map();
     oTests1.mapTo();
     oTests1.filter();
     oTests1.do(); //Renommé en tap() dans RxJs6
     oTests1.pluck();
     oTests1.first();
     oTests1.startWith();
     oTests1.create();
     oTests1.every();
     oTests1.distinctUntilChanged();
     oTests1.defaultEmpty();

}

//---------------------------------------

const oTests1 = {
    init() {
        
    },

    //------------------------------
    range() { //Static operator
        console.log("\n\n", "*********************** Rx.Observable.range ***********************", "\n\n");
        const oObservable = Rx.Observable.range(1,5);
        oObservable.subscribe((piNumber)=>{
            console.log(piNumber);
        }); // Affichera(donc émettra) : 1  2  3  4  5
    },
    of() {  //Static operator .Operator très générique.
        console.log("\n\n", "*********************** Rx.Observable.of ***********************", "\n\n");
        const anyValue = [1,2,3,4];
        const oObservable = Rx.Observable.of(anyValue);
        oObservable.subscribe((pValue)=>{
            console.log(pValue === anyValue); // TRUE !!!!
            console.log(pValue, "\n\n");
        }); //Affichera(donc émettra) : [1 2 3 4] (Array, donc la variable même originale (car par adresse!))

        const oObservable2 = Rx.Observable.of("A",9,6,[10,20,30],7); //Plusieurs values, possible !
        oObservable2.subscribe((pValue)=>{
            console.log(pValue);
        }); //Affichera(donc émettra) : A  9  6  [10,20,30]   7       
    },
    from() { //Static operator
        console.log("\n\n", "*********************** Rx.Observable.from ***********************", "\n\n");
        const aArray = [1,2,3,4];
        const oObservable = Rx.Observable.from(aArray);
        oObservable.subscribe((pArrayElem)=>{
            console.log(pArrayElem);
        }); //Affichera(donc émettra) :   1  2  3  4 
        // Émet donc chaque valeur du tableau.
        console.log('\n');

        //-------- Attention code ci-dessous ASYNCHRONE
        if (false) {
            const aArray2 = [1,"2",{x:3},4, [10,20]];
            const oPromise = new Promise((pfResolve, pfReject)=>{
                if (true) {
                    pfResolve(aArray2);
                } else pfReject("Erreur !!!!!!!"); //Dans ce cas, une Exception est directement levée; et le code ci-dessous, ne sera pas exécuté !
            });
            //On arrive ici que si Promise non rejected.
            const oObservable2 = Rx.Observable.from(oPromise);
            oObservable2.subscribe((pPromiseResolveResult)=>{
                console.log(pPromiseResolveResult);
                console.log(pPromiseResolveResult instanceof Array); //TRUE
                console.log(pPromiseResolveResult === aArray2); //TRUE
                console.log('\n\n');
            }); //Affichera(donc émettra) :   [1,"2",{x:3},4, [10,20]]     (=== aArray2)
            // Émet donc la valeur(ici un tableau) retournée par la Promise résolue.
        }
    },        
    interval_timer() { //Static operators
        const bTest1 = false;
        if (bTest1) { // Pour ne pas interférer avec l'autre timer asynchrone ci-dessous
            console.log("\n\n", "*********************** Rx.Observable.interval ***********************", "\n\n");
            const oObservable = Rx.Observable.interval(1000); //1000ms
            let oSubscription = oObservable.subscribe((piCounter)=>{
                if (piCounter<(5+1)) {
                    console.log(piCounter+" emitted each 1 second ! ");
                } else oSubscription.unsubscribe(); //Sinon ne s'arrêtera jamais.
                
            }); //Affichera(donc émettra) :   0  1  2  3  4  5 .  (1 par seconde (1000ms))
            console.log('\n');     
        }
        
        if (!bTest1) { // Pour ne pas interférer avec l'autre timer asynchrone ci-dessus
            console.log("\n\n", "*********************** Rx.Observable.timer ***********************", "\n\n");
            const iDelay = 4000;
            const iThenInterval = 1500;
            const oObservable2 = Rx.Observable.timer(iDelay, iThenInterval); //Emettra ttes les iThenInterval ms , 
                                                                            // mais seulement après iDelay ms !
            let oSubscription2 = oObservable2.subscribe((piCounter)=>{
                if (piCounter<(5+1)) {
                    console.log(piCounter+` emitted each ${iThenInterval/1000} seconds ! `);
                } else oSubscription2.unsubscribe(); //Sinon ne s'arrêtera jamais.
                
            }); //Affichera(donc émettra) :   0 1  2  3  4  5 .  (1 par iThenInterval ms)
            console.log('\n');     
            
            //REMARQUE: le second param. de timer() est facultatif, auquel cas on a un fonctionnement équiv. à setTimeout :
            const iDelay2 = 7000;
            const oObservable3 = Rx.Observable.timer(iDelay2);
            oObservable3.subscribe(()=>{
                console.log(`  >Here after ${iDelay2/1000} seconds ! `);
            });
            console.log('\n');             
        }
    },        
    map() {
        console.log("\n\n", "*********************** map ***********************", "\n\n");
        const dataToConvert = [1,2,3,4];
        const oObservable = Rx.Observable.from(dataToConvert);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( map(...) ).subscribe(...)
        .map((pReceivedData) => {return("*"+pReceivedData+"*");})
        .subscribe((pConvertedData)=>{
            console.log(pConvertedData);
        }); //Affichera(donc émettra) :   *1*  *2*  *3*  *4*
        console.log('\n');        
    },  
    mapTo() {
        console.log("\n\n", "*********************** mapTo ***********************", "\n\n");
        const dataToConvert = [1,2,3];
        const oObservable = Rx.Observable.from(dataToConvert);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( mapTo(...) ).subscribe(...)
        .mapTo("All received data converted to this one value ! :)")
        .subscribe((pConvertedData)=>{
            console.log(pConvertedData);
        }); //Affichera(donc émettra) :   3 fois la phrase :   All received data converted to this one value ! :)
        console.log('\n');        
    },            
    filter() {
        console.log("\n\n", "*********************** filter ***********************", "\n\n");
        const dataToConvert = [1,2,3,25,8,21,20,200];
        const oObservable = Rx.Observable.from(dataToConvert);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( filter(...) ).subscribe(...)
        .filter((pReceivedData)=>{return(pReceivedData>20);}) //Ce genre de callback, sélectionnant ou non un elem(en renvoyant true ou false), s'appelle une predicate function.
        .subscribe((pFilteredData)=>{
            console.log(pFilteredData);
        }); //Affichera(donc émettra) :   25  21  200
        console.log('\n');         
    },        
    do() { //Renommé en tap() dans RxJs6
        console.log("\n\n", "*********************** do (devenu tap en RxJs6) ***********************", "\n\n");
        const data = [1,2,3];
        const oObservable = Rx.Observable.from(data);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( tap(...) ).subscribe(...)
        .do((pCurrentData)=>{console.log("...Kind of intermediate personnal operation here, that can read the current emitted data :"+pCurrentData);})
        .subscribe((pCurrentData)=>{
            console.log(pCurrentData);
        }); //Affichera(donc émettra) :   1  2  3    (mais chacun précédé de l'instruction exécutée dans do(), donc ici un console.log(...))
        //REMARQUE : si do() , reçoit en param une data de type objet, il peut en effet en modifier les propriétés
        //           impactant alors le flux ! MAIS, ce genre de pratique n'est pas recommandé ! ce qui est fait dans do()
        //           est censé ne pas être voué à altérer le flux, juste le lire "pour faire un point" à un endroit précis 
        //           du flux donc.
        console.log('\n');         
    },        
    pluck() {
        console.log("\n\n", "*********************** pluck ***********************", "\n\n");
        const data = [{prenom:"Joe", nom:"Cox"}, {prenom:"Max", nom:"B."}, {prenom:"Jess", nom:"Marley"}];
        const oObservable = Rx.Observable.from(data);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( pluck(...) ).subscribe(...)
        .pluck("prenom") //<<<<< ATTENTION, s'il s'agissait du nom d'une méthode (genre: "getPrenom"), il renverrait la méthode elle-même ! et non ce qu'elle retourne !
        .subscribe((pCurrentData)=>{
            console.log(pCurrentData);
        });
         //Affichera(donc émettra) :   Joe  Max  Jess
    },        
    first() {
        console.log("\n\n", "*********************** first ***********************", "\n\n");
        const data = [10,80, -12 ,18,29,30];
        const oObservable = Rx.Observable.from(data);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( first(...) ).subscribe(...)
        .first((pReceivedData)=>{return(pReceivedData<0);}) //Si on avait mis par ex.  '>30' au lieu de notre '>0', 
                                                            //alors une Exception aurait été générée car éléments 
                                                            //non trouvé dans la totalité du flux.
        .subscribe((pCurrentData)=>{
            console.log(pCurrentData);
        });
         //Affichera(donc émettra) :   -12   (le PREMIER élément du flux, vérifiant le prédicat (<0))
         //L'observable est à l'état complete si trouvé.

         const oObservable2 = Rx.Observable.from(data);
         oObservable2 //ATTENTION : en RxJs6, il faudra utiliser : oObservable2.pipe( first(...) ).subscribe(...)
         .first()  //Equivaut à first((pReceivedData)=>{return(true);})
         .subscribe((pCurrentData)=>{
             console.log(pCurrentData);
         });
        //Affichera(donc émettra) :   10   (le PREMIER élément du flux, tout simplement)
    },        
    startWith() {
        console.log("\n\n", "*********************** startWith ***********************", "\n\n");
        const data = [10,80, -12 ,18,];
        const oObservable = Rx.Observable.from(data);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( startWith(...) ).subscribe(...)
        .startWith(400 , 500, "Hello", " ") //Va placer ces éléments en tout début du flux.
        .subscribe((pData)=>{
            console.log(pData);
        });   
        //Affichera(donc émettra) :  400 500 Hello  10 80 -12  18 
        console.log('\n\n');

        const oObservable2 = Rx.Observable.from(data);
        oObservable2 //ATTENTION : en RxJs6, il faudra utiliser : oObservable2.pipe( startWith(...) ).subscribe(...)
        .startWith("Here's the list : ") //Va placer cet élément en tout début du flux.
        .subscribe((pData)=>{
            console.log(pData);
        });   
        //Affichera(donc émettra) :  400 500 Hello  10 80 -12  18         
        console.log('\n\n');

        const oObservable3 = Rx.Observable.from(data);
        const aFirstOnes = ["STARTING", "THERE", "FRIENDS"];
        oObservable3 //ATTENTION : en RxJs6, il faudra utiliser : oObservable3.pipe( startWith(...) ).subscribe(...)
        .startWith(...aFirstOnes)
        .subscribe((pData)=>{
            console.log(pData);
        });   
        //Affichera(donc émettra) :  400 500 Hello  10 80 -12  18        
    },        
    create() {
        console.log("\n\n", "*********************** Rx.Observable.create **********************");
        console.log(" ************** apparemment idem que : new Rx.Observable ************\n\n");
        const oObservable = Rx.Observable.create((poObserver)=>{
        //const oObservable = new Rx.Observable((poObserver)=>{ //Semble équivalente à la ligne du dessus.
            poObserver.next("updates/notifies the observer with this value!");
        });

        const fObserver1 = (pValue)=> {console.log("fObserver1 updated: "+pValue);}
        const fObserver2 = (pValue)=> {console.log("fObserver2 updated: "+pValue);}

        oObservable.subscribe(fObserver1);
        oObservable.subscribe(fObserver2);

        console.log('\n');
        oObservable.startWith("First value", "Second value").subscribe(fObserver1);
        //Émettra :  First value   Second value    updates/notifies the observer with this value!
        //           vers l'oberver : fObserver1()
        console.log('\n\n');        
    },        
    every() {
        console.log("\n\n", "*********************** every ***********************", "\n\n");
        //const dataToConvert = [10,400,-6,40,15];
        const dataToConvert = [10,400,6,40,15];
        const oObservable = Rx.Observable.from(dataToConvert);
        oObservable //ATTENTION : en RxJs6, il faudra utiliser : oObservable.pipe( filter(...) ).subscribe(...)
        .do((pReceivedData)=>{console.log("Examen de la valeur "+pReceivedData+", du flux,")})
        .every((pReceivedData)=>{return(pReceivedData>0);}) //Ce genre de callback, sélectionnant ou non un elem(en renvoyant true ou false), s'appelle une predicate function.
        .subscribe((pbBoolean)=>{
            //console.log(typeof(pbBoolean)); //"boolean"
            if (pbBoolean===true) {
                console.log(" Toutes les valeurs du flux ont vérifié le prédicat avec succès (valeur>0).");
            } else {
                console.log(" Les valeurs du flux, ne vérifient pas toutes le prédicat (valeur>0).");
            }
        }); //Affichera(donc émettra) :   25  21  200
        console.log('\n');         
    },        
    distinctUntilChanged() {
    },        
    defaultEmpty() {
    }        
}



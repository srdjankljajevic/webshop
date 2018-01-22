var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('MyCtrl', function($scope, $window, $http, $uibModal) {
    var vm = this;

    vm.searchText = "";
    vm.svi_proizvodi = [];
    vm.proizvodi = [];

    vm.username = 'email@singi.ac.rs';

    vm.listaKategorija = [];
    vm.kategorijeProizvoda = {};
    vm.korpa = [];

    vm.kategorija = null;
    vm.proizvod = null;

    $scope.alerts = [
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    vm.currentPage = 1;
    vm.itemsPerPage = 16;
    vm.totalItems = 10;
    vm.maxSize = 5;

    // Zadatak 3. e --------start------------
    vm.autorizovan = false;

    vm.login = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: function($uibModalInstance, parent){
            var $ctrl = this;

            $ctrl.stanje = 'Login';

            $ctrl.username = parent.username;
            
            // funkcija koja se aktivira na dugme Login/Signin
            $ctrl.login = function(){
              $uibModalInstance.close($ctrl.username);
            }

            $ctrl.register = function(){
              $uibModalInstance.close($ctrl.username);
            }

            $ctrl.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
        },
        controllerAs: '$ctrl',
        resolve: {
          parent: function () {
            return vm;
          }
        }
      });
	  
	  
	  
	  vm.zakljuciKupovinu = function(){
        var sum = 0;
        if(vm.user!==null){
            var alert = {type: 'success', msg: 'uspesno ste kupili' };
            $scope.alerts.push(alert);
            for(var i in vm.korpa){
                console.log(vm.korpa[i].proizvod.cena);
                console.log(vm.korpa[i].kolicina);
               sum+= vm.korpa[i].proizvod.cena * vm.korpa[i].kolicina;
            }
            
            vm.racun =  sum;
            
            
        }else{
            var alert = {type: 'danger', msg: 'niste ulogovani' };
            $scope.alerts.push(alert);
        }
    };
	  
	  
	   

      modalInstance.result.then(function (username) {
        console.log(username);
        // dodatak za zadatak 3. e
        vm.autorizovan = true;
        console.log('modal-component dismissed at: ' + new Date());
      });
    };
    // Zadatak 3. f. ---------- end -------------------

    vm.editProizvoda = function(el){
      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'editMovie.html',
        controller: function($uibModalInstance, movie){
            var $ctrl = this;

            $ctrl.title = movie.title;

            $ctrl.save = function(){
              $uibModalInstance.close($ctrl.title);
            }

            $ctrl.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
        },
        controllerAs: '$ctrl',
        resolve: {
          movie: function () {
            return el;
          }
        }
      });

      modalInstance.result.then(function (title) {
        el.title = title;
      }, function () {
        console.log('modal-component dismissed at: ' + new Date());
      });
    }

    vm.home = function(){
      vm.kategorija = null;
      vm.proizvod = null;
      vm.proizvodi = vm.svi_proizvodi;
      vm.totalItems = vm.proizvodi.length;
    }
    vm.filterKategorije = function(kategorija){
      vm.kategorija = kategorija;
      vm.proizvod = null;
      vm.proizvodi = vm.kategorijeProizvoda[kategorija];
      vm.totalItems = vm.proizvodi.length;
    }

    // Zadatak 1. b --------start----------------
    vm.ocene = [1, 2, 3, 4, 5];
    vm.filterOcene = function(el){
        var lista = [];
        for(var i in vm.svi_proizvodi){
            var proizvod = vm.svi_proizvodi[i];
            if(proizvod.ocena == el){
                lista.push(proizvod);
            }
        }
        vm.proizvodi = lista;
        vm.totalItems = vm.proizvodi.length;
    }
    // Zadatak 1. b ---------end---------------


    // Zadatak 1. c --------start----------------
    vm.filterCena = function(cena1, cena2){
        var lista = [];
        for(var i in vm.svi_proizvodi){
            var proizvod = vm.svi_proizvodi[i];
            if(cena1<=proizvod.cena && proizvod.cena<=cena2){
                lista.push(proizvod);
            }
        }
        vm.proizvodi = lista;
        vm.totalItems = vm.proizvodi.length;
    }
    // Zadatak 1. c ---------end---------------



    vm.selektujProizvod = function(el){
      vm.kategorija = el.kategorija;
      vm.proizvod = el;
    }

    vm.init = function(){
      var req = {
          method: "GET",
          //url: "http://88.99.171.79:8080/filmovi?search="+vm.searchText
          url: "proizvodiIspit.json"
      }
      $http(req).then(
          function(resp){
            console.log(resp);
            var lista = [];
            vm.svi_proizvodi = resp.data;
            vm.kategorijeProizvoda = {};
            vm.listaKategorija = [];
            for(var i in vm.svi_proizvodi){
              var proizvod = vm.svi_proizvodi[i];
              if(!(proizvod.kategorija in vm.kategorijeProizvoda)){
                vm.listaKategorija.push(proizvod.kategorija);
                vm.kategorijeProizvoda[proizvod.kategorija] = [proizvod];
              }else{
                vm.kategorijeProizvoda[proizvod.kategorija].push(proizvod);
              }
              if(proizvod.naziv.toLowerCase().indexOf(vm.searchText.toLowerCase())!=-1){
                lista.push(proizvod);
              }
            }
            vm.totalItems = lista.length;
            vm.proizvodi = lista;
          }, function(resp){
              vm.message = 'error';
          });
    };
	

    // zadatak 2. e --------start------------- 
    vm.kolicina = 1;
    vm.kupi = function(el){
      if(vm.kolicina < el.kolicina){
        vm.korpa.push({proizvod: el, kolicina: vm.kolicina});
        $scope.alerts.push({ type: 'success', msg: 'Proizvod prebacen u korpu!' } );
      }else{
        $scope.alerts.push({ type: 'danger', msg: 'Trazena kolicina je prevelika, pokusajte sa manjom kolicinom!' } );
      }
    };
    // zadatak 2. e --------end-------------

    // zadatak 3. f --------start-------------
		
	
	
    
	
//	vm.kupi = function(el){
  //    if(vm.autorizovan==true){
    //      if(vm.kolicina < el.kolicina){
      //      vm.korpa.push({proizvod: el, kolicina: vm.kolicina});
        //    $scope.alerts.push({ type: 'success', msg: 'Proizvod prebacen u korpu!' } );
          //}else{
            //$scope.alerts.push({ type: 'danger', msg: 'Trazena kolicina je prevelika, pokusajte sa manjom kolicinom!' } );
//		  }
  //    }else{
    //    vm.login();
     // }
    //};
	
	
	
	
	
	
    // zadatak 3. f --------end-------------


    // zadatak 3. g --------start-------------
    vm.ukupnaCena = 0;
    vm.kupi = function(el){
      if(vm.autorizovan==true){
          if(vm.kolicina < el.kolicina){
            vm.korpa.push({proizvod: el, kolicina: vm.kolicina});
            if (el.popust != 0) {
                vm.ukupnaCena =+ vm.kolicina*(el.cena - (el.cena * (el.popust / 100)));
            } else {
                vm.ukupnaCena =+ vm.kolicina*el.cena;
            }
            if (vm.kolicina > 10) {
                vm.ukupnaCena += vm.kolicina*(el.cena - (el.cena * (el.popust / 100)));
                vm.ukupnaCena = vm.ukupnaCena * 0.95;
            }
            $scope.alerts.push({ type: 'success', msg: 'Proizvod prebacen u korpu!' } );
          }else{
            $scope.alerts.push({ type: 'danger', msg: 'Trazena kolicina je prevelika, pokusajte sa manjom kolicinom!' } );
          }
      }else{
        vm.login();
      }
    };
    // zadatak 3. f --------end-------------

	
	
	vm.kupi = function(el){
        console.log("test");
        if(el.kolicina < vm.kolicina){
            var alert = {type: 'danger', msg:'Trazena kolicina je prevelika, pokusajte sa manjom kolicinom!'};
            $scope.alerts.push(alert);
        }else{
            
            vm.korpa.push({proizvod: el, kolicina: vm.kolicina});
            el.kolicina = el.kolicina - vm.kolicina ;
            $scope.alerts.push({ type: 'success', msg: 'Proizvod prebacen u korpu!' } );
           
            
        }
      
    };
	
	
    vm.init();
    vm.popust = function () {
        var lista = [];                        
        for(var i in vm.svi_proizvodi){
          var proizvod = vm.svi_proizvodi[i];
          if(proizvod.popust != 0){
            lista.push(proizvod);
          }
        }
        vm.totalItems = lista.length;
        vm.proizvodi = lista;  
    }

});

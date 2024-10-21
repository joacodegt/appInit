var app = angular.module("InventarioManagement", []);
$(document).ready(function() {
    $('#menuToggle').on('click', function() {
        $('.ui.sidebar').sidebar('toggle');
    });
    $('.ui.sidebar .item').on('click', function() {
        $('.ui.sidebar').sidebar('hide');
    });
});
app.controller("InventarioManagementController", ['$scope', '$http', '$httpParamSerializerJQLike', function ($scope, $http, $httpParamSerializerJQLike) {
    $scope.lista = [
        // { "nombre": "Nueva Bitacora", "icon": "edit" },
        // { "nombre": "Ver / Editar Bitacora", "icon": "file alternate outline" },
        { "nombre": "catalogos", "icon": "book" },
        { "nombre": "reportes", "icon": "chart bar" }
    ];
    $scope.menu = [];
    $scope.paginas = 0;
    $scope.pagina = 1;
    $scope.maquina = [];
    $scope.frente = [];
    $scope.bitacora = [];
    $scope.operador = [];
    $scope.pattern = '';
    $scope.nuevoTipo = '';
    $scope.formulario = {};
    $scope.metodo = '';
    $scope.catalogoSeleccionado = '';
    iniciar()
    function iniciar() {

        $scope.lista.forEach(function(listaItem) {
            listaItemNombreMayus = listaItem.nombre.charAt(0).toUpperCase() + listaItem.nombre.slice(1).toLowerCase();
            $('#contenido'+listaItemNombreMayus).hide();
        });
        desaparecer();
        getLista('menu');
        $scope.menu.forEach(function(item) {
            getLista(item.nombre.toLowerCase());
        });
        Highcharts.chart('grafica', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Disponibilidad de maquinas',
                align: 'left'
            },
            subtitle: {
                text:
                    '',
                align: 'left'
            },
            xAxis: {
                categories: ['5/01/2023','14/01/2023','9/01/2023','1/01/2023','2/01/2023','12/01/2023','7/01/2023','11/01/2023','13/01/2023','15/01/2023','10/01/2023','3/01/2023','6/01/2023','4/01/2023','13/10/2024','17/10/2024','8/01/2023'],
                crosshair: true,
                accessibility: {
                    description: 'dias'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'maquinas'
                }
            },
            tooltip: {
                valueSuffix: ' maquinas'
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: [
                {
                    name: 'disponibles',
                    data: [63,64,63,63,63,63,63,63,83,63,63,63,63,63,83,81,63]
                },
                {
                    name: 'en Uso',
                    data: [21,20,21,21,21,21,21,21,1,21,21,21,21,21,1,3,21]
                }
            ]
        });
        var tokenDebugger = document.getElementById('token-debugger').innerText;
        var json = JSON.parse(tokenDebugger)

        var html = '';
        var keysToShow = ['name', 'email', 'unique_name'];
        for (var key in json) {
            if (json.hasOwnProperty(key) && keysToShow.includes(key)) {
                html += '<div><strong>' + key + ':</strong> ' + json[key] + '</div>';
            }
        }
        document.getElementById('token-debugger').innerHTML = html;
    }
    $scope.ver = function (item, tipo, metodo,page) {
        switch (tipo) {
            case "contenido":
                switch (item.nombre) {
                    case "reportes":
                    case "catalogos":
                        itemNombreMayus = item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1).toLowerCase();
                        $scope.lista.forEach(function(listaItem) {
                            listaItemNombreMayus = listaItem.nombre.charAt(0).toUpperCase() + listaItem.nombre.slice(1).toLowerCase();                        
                            if (listaItemNombreMayus !== itemNombreMayus) {
                                $('#contenido'+listaItemNombreMayus).hide();
                            }else{
                                $('#contenido'+itemNombreMayus).show();
                            }
                        });
                        $('#contenidoInicio').hide();
                        desaparecer();
                        break;
                    default:
                        break;
                }
                switch (item) {
                    case "inicio":
                        $('#contenidoInicio').show();   
                        $scope.lista.forEach(function(listaItem) {
                            listaItemNombreMayus = listaItem.nombre.charAt(0).toUpperCase() + listaItem.nombre.slice(1).toLowerCase();
                            $('#contenido'+listaItemNombreMayus).hide();
                        });
                        desaparecer();
                        break;
                    case "configuracion":
                        $('#contenidoConfiguracion').modal('show');
                        break;
                    case "notificaciones":
                        $('#contenidoNotificacion').modal('show');
                        break;
                }
                break;
            case "operador":
            case "frente":
            case "finca":
            case "bitacora":
            case "maquina":
                getPaginacion(tipo);
                getLista(tipo,page);
                tipoMayus = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
                switch (metodo) {
                    case "ver":
                        $scope.menu.forEach(function(menuItem) {
                            var menuItemLower = menuItem.toLowerCase();
                            if (menuItemLower !== tipo) {
                                $("#" + menuItemLower).hide();
                                $('#item' + menuItem).removeClass('active');
                            } else {
                                $scope.catalogoSeleccionado = tipo;
                                $("#" + tipo).show();
                                $('#item' + menuItem).addClass('active');
                            }
                        });
                        $scope.pattern = '';
                        break;
                    case "agregar":
                        if (tipo == 'bitacora') {
                            getLista("operador");
                            getLista("frente");
                            getLista("maquina");
                            getLista("finca");
                        }
                        $scope.metodo = metodo
                        if (item === 'agregar') {
                            $scope.formulario = {}
                        } else {
                            $scope.formulario = item
                        }
                        $("#tituloModal_editar_agregar_"+tipo).text("Agregar " + tipoMayus);
                        $('#editar_agregar_'+tipo).modal('show');
                        break;
                    case "editar":
                        if (tipo == 'bitacora') {
                            getLista("operador");
                            getLista("frente");
                            getLista("maquina");
                            getLista("finca");
                        }
                        $scope.formulario[tipo] = item
                        $("#tituloModal_editar_agregar_"+tipo).text("Editar " + tipoMayus);
                        $('#editar_agregar_'+tipo).modal('show');
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }
    $scope.logout = function (){
        window.location.href = '/logout';
    }
    function desaparecer(){
        $scope.menu.forEach(function(menuItem) {
            var menuItemLower = menuItem.toLowerCase();
            $scope.catalogoSeleccionado = '';
            $("#" + menuItemLower).hide();
            $('#item' + menuItem).removeClass('active');
        });
    }
    function getLista(tipo,page) {
        var url = '/catalogo/' + tipo + '/buscar?pattern=' + $scope.pattern + '&size=' + 100;
        if (page !== null && page !== undefined) {
            url += '&page=' + page;
            $scope.pagina = page;
        }else{
            $scope.pagina = 1;
        }
        // alert(url);
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            $scope[tipo] = response.data;
            if (tipo == 'bitacora') {
                $scope[tipo].forEach(function(item) {
                item.supervisor = JSON.parse(item.supervisor);
            }); 
            }
        }, function errorCallback(response) {
            alert(response.statusText);
        });
    }

    function getPaginacion(tipo) {
        var url = '/catalogo/paginacion?modelo=' + tipo;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            var cantidadElementos = Array.from({ length: Math.ceil(response.data / 100) }, (_, i) => i + 1);
            $scope.paginas = cantidadElementos;
        }, function errorCallback(response) {
            alert(response.statusText);
        });
    }
    function httpMetodo(method, url, data, tipo) {
        $http({
            method: method,
            url: url,
            data: $httpParamSerializerJQLike(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            $scope._correcto(response, tipo);
        }, $scope._error);
    }
    $scope.guardar = function (tipo, formulario) {
        data = {};
        validacion = ($scope.formulario[tipo].id == -1 || $scope.formulario[tipo].id === undefined)
        method = validacion ? 'PUT' : 'POST';
        url = validacion ? '/catalogo/' + tipo : '/catalogo/' + tipo + '/' + formulario[tipo].id;
        data = ($scope.formulario[tipo]);
        if (tipo == 'bitacora') {
            data = {
                "operador": $scope.formulario[tipo].operador.id,
                "maquina": $scope.formulario[tipo].maquina.id,
                "frente": $scope.formulario[tipo].frente.id,
                "finca": $scope.formulario[tipo].finca.id,
                "horometroInicio": $scope.formulario[tipo].horometroInicio,
                "galones": $scope.formulario[tipo].galones
            }
        }
        httpMetodo(method, url, data, tipo)
    }
    $scope.eliminar = function (tipo, formulario) {
        data = {};
        method = 'DELETE';
        url = '/catalogo/' + tipo + '/' + formulario.id;
        httpMetodo(method, url, data,tipo);
    }
    $scope._error = function (response) {
        alert(response.data.message || response.statusText);
    }
    $scope._correcto = function (response, tipo) {
        $scope.pattern = '';
        alert(JSON.stringify(response));
        getLista(tipo);
    }
}]);
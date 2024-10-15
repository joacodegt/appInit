var app = angular.module("InventarioManagement", []);
app.controller("InventarioManagementController", ['$scope', '$http', '$httpParamSerializerJQLike', function ($scope, $http, $httpParamSerializerJQLike) {
    $scope.lista = [
        // { "nombre": "Nueva Bitacora", "icon": "edit" },
        // { "nombre": "Ver / Editar Bitacora", "icon": "file alternate outline" },
        { "nombre": "catalogos", "icon": "book" },
        { "nombre": "reportes", "icon": "chart bar" }
    ];
    $scope.menu = [];
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

            title: {
                text: 'Desperfectos por equipo',
                align: 'left'
            },

            subtitle: {
                text: 'Cantidad de desperfectos por mes y equipo',
                align: 'left'
            },

            yAxis: {
                title: {
                    text: 'Desperfectos'
                }
            },

            xAxis: {
                accessibility: {
                    rangeDescription: 'Range: 1 to 12'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 1
                }
            },
            series: [{
                name: 'ckl60-cm3',
                data: [1, 2, 1, 3, 0, 0,
                    1, 0, 0, 2, 4]
            }, {
                name: 'GS3BA-60CH',
                data: [0, 0, 0, 0, 0, 0,
                    2, 0, 0, 0, 1]
            }, {
                name: 'YAU-60CR',
                data: [1, 2, 1, 1, 1, 1,
                    0, 0, 1, 0, 1]
            }, {
                name: 'GS3BA-60CH',
                data: [null, null, null, 3, 2, 1, 1,
                    0, 0, 0, 0]
            },],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 50
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
        Highcharts.chart('graficaEquiposEnMantenimiento', {
            chart: {
                type: 'column'
            },
            title: {
                align: 'left',
                text: 'Cantidad de equipos en mantenimiento por mes'
            },
            subtitle: {
                align: 'left',
                text: ''
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                type: 'mes'
            },
            yAxis: {
                title: {
                    text: 'Equipos en mantenimiento'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 1,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [
                {
                    name: 'Equipos',
                    colorByPoint: true,
                    data: [
                        {
                            name: 'Enero',
                            y: 2,
                            drilldown: 'Enero'
                        },
                        {
                            name: 'Febrero',
                            y: 3,
                            drilldown: 'Febrero'
                        },
                        {
                            name: 'Marzo',
                            y: 1,
                            drilldown: 'Marzo'
                        },
                        {
                            name: 'Abril',
                            y: 3,
                            drilldown: 'Abril'
                        },
                        {
                            name: 'Mayo',
                            y: 2,
                            drilldown: 'Mayo'
                        },
                        {
                            name: 'Junio',
                            y: 1,
                            drilldown: 'Junio'
                        },
                        {
                            name: 'Julio',
                            y: 0,
                            drilldown: 'Julio'
                        }
                    ]
                }
            ],
            drilldown: {
                breadcrumbs: {
                    position: {
                        align: 'right'
                    }
                },
                series: [
                    {
                        name: 'Enero',
                        id: 'Enero',
                        data: [
                            [
                                'v65.0',
                                0.1
                            ],
                            [
                                'v64.0',
                                1.3
                            ],
                            [
                                'v63.0',
                                53.02
                            ],
                            [
                                'v62.0',
                                1.4
                            ],
                            [
                                'v61.0',
                                0.88
                            ],
                            [
                                'v60.0',
                                0.56
                            ],
                            [
                                'v59.0',
                                0.45
                            ],
                            [
                                'v58.0',
                                0.49
                            ],
                            [
                                'v57.0',
                                0.32
                            ],
                            [
                                'v56.0',
                                0.29
                            ],
                            [
                                'v55.0',
                                0.79
                            ],
                            [
                                'v54.0',
                                0.18
                            ],
                            [
                                'v51.0',
                                0.13
                            ],
                            [
                                'v49.0',
                                2.16
                            ],
                            [
                                'v48.0',
                                0.13
                            ],
                            [
                                'v47.0',
                                0.11
                            ],
                            [
                                'v43.0',
                                0.17
                            ],
                            [
                                'v29.0',
                                0.26
                            ]
                        ]
                    },
                    {
                        name: 'Febrero',
                        id: 'Febrero',
                        data: [
                            [
                                'v58.0',
                                1.02
                            ],
                            [
                                'v57.0',
                                7.36
                            ],
                            [
                                'v56.0',
                                0.35
                            ],
                            [
                                'v55.0',
                                0.11
                            ],
                            [
                                'v54.0',
                                0.1
                            ],
                            [
                                'v52.0',
                                0.95
                            ],
                            [
                                'v51.0',
                                0.15
                            ],
                            [
                                'v50.0',
                                0.1
                            ],
                            [
                                'v48.0',
                                0.31
                            ],
                            [
                                'v47.0',
                                0.12
                            ]
                        ]
                    },
                    {
                        name: 'Marzo',
                        id: 'Marzo',
                        data: [
                            [
                                'v11.0',
                                6.2
                            ],
                            [
                                'v10.0',
                                0.29
                            ],
                            [
                                'v9.0',
                                0.27
                            ],
                            [
                                'v8.0',
                                0.47
                            ]
                        ]
                    },
                    {
                        name: 'Abril',
                        id: 'Abril',
                        data: [
                            [
                                'v11.0',
                                3.39
                            ],
                            [
                                'v10.1',
                                0.96
                            ],
                            [
                                'v10.0',
                                0.36
                            ],
                            [
                                'v9.1',
                                0.54
                            ],
                            [
                                'v9.0',
                                0.13
                            ],
                            [
                                'v5.1',
                                0.2
                            ]
                        ]
                    },
                    {
                        name: 'Mayo',
                        id: 'Mayo',
                        data: [
                            [
                                'v16',
                                2.6
                            ],
                            [
                                'v15',
                                0.92
                            ],
                            [
                                'v14',
                                0.4
                            ],
                            [
                                'v13',
                                0.1
                            ]
                        ]
                    },
                    {
                        name: 'Junio',
                        id: 'Junio',
                        data: [
                            [
                                'v50.0',
                                0.96
                            ],
                            [
                                'v49.0',
                                0.82
                            ],
                            [
                                'v12.1',
                                0.14
                            ]
                        ]
                    }
                ]
            }
        });
        Highcharts.chart('graficaInidiceMantenimientoArea', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            title: {
                text: 'Indice de mantenimiento por area',
                align: 'left'
            },
            subtitle: {
                text: '',
                align: 'left'
            },
            plotOptions: {
                pie: {
                    innerSize: 100,
                    depth: 45
                }
            },
            series: [{
                name: 'Medals',
                data: [
                    ['ccm tachos bacht', 0]
                    , ['ccm tachos 1ra cristal ', 1]
                    , ['ccm continua 1ra crudo ', 2]
                    , ['ccm continua 2da crudo', 0]
                    , ['ccm clarificacion', 0]
                    , ['ccm crudo lado A', 0]
                    , ['ccm crudo lado B', 3]
                    , ['ccm envasado del A', 0]
                    , ['ccm continuas 2da crudo', 0]
                    , ['ccm bba Cristal', 4]
                    , ['ccm sala variadores cald#09', 0]
                    , ['ccm sala variadores cald#10', 0]
                    , ['ccm sala variadores cald#11', 0]
                ]
            }]
        });
    }
    $scope.ver = function (item, tipo, metodo) {
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
                getLista("operador");
                getLista("frente");
                getLista("maquina");
                getLista("finca");
            case "maquina":
                getLista(tipo);
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
                        break;
                    case "agregar":
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

    function desaparecer(){
        $scope.menu.forEach(function(menuItem) {
            var menuItemLower = menuItem.toLowerCase();
            $scope.catalogoSeleccionado = '';
            $("#" + menuItemLower).hide();
            $('#item' + menuItem).removeClass('active');
        });
    }
    function getLista(tipo) {
        $http({
            method: 'GET',
            url: '/catalogo/'+tipo+'/buscar?pattern=' + $scope.pattern
        }).then(function successCallback(response) {
            $scope[tipo] = response.data;
        }, function errorCallback(response) {
            alert(response.statusText);
        });
    }
    $scope.buscar = function (tipo) {
        switch (tipo) {
            case 'equipo':
                getEquipos()
                break;
            case 'actividad':
                getActividades()
                break;

            default:
                break;
        }
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
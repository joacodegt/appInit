var app = angular.module("InventarioManagement", []);
app.controller("InventarioManagementController", ['$scope', '$http', '$httpParamSerializerJQLike', function ($scope, $http, $httpParamSerializerJQLike) {

    $scope.lista = [
        { "nombre": "Nueva Bitacora", "cantidad": 0 },
        { "nombre": "Ver / Editar Bitacora", "cantidad": 0 },
        { "nombre": "catalogos", "cantidad": 0 },
        { "nombre": "reportes", "cantidad": 0 }
    ];
    $scope.maquinas = [];
    $scope.frentes = [];
    $scope.operadores = [];

    
    $scope.pattern = '';
    $scope.nuevoTipo = '';
    $scope.formulario = {};
    $scope.metodo = '';
    $scope.catalogoSeleccionado = '';

    iniciar()

    function getMaquina() {
        $http({
            method: 'GET',
            url: '/catalogo/maquina/buscar?pattern=' + $scope.pattern
        }).then(function successCallback(response) {
            alert(response.data)
            $scope.maquinas = response.data;
        }, function errorCallback(response) {
            alert(response.statusText);
        });
    }
    function getFrente() {
        $http({
            method: 'GET',
            url: '/catalogo/frente/buscar?pattern=' + $scope.pattern
        }).then(function successCallback(response) {
            $scope.frentes = response.data;
        }, function errorCallback(response) {
            alert(response.statusText);
        });
    }
    function getOperador() {
        $http({
            method: 'GET',
            url: '/catalogo/operador/buscar?pattern=' + $scope.pattern
        }).then(function successCallback(response) {
            $scope.operadores = response.data;
        }, function errorCallback(response) {
            alert(response.statusText);
        });
    }
    function getEquipos() {
        $http({
            method: 'GET',
            url: '/equipo/buscar?pattern=' + $scope.pattern
        }).then(function successCallback(response) {
            $scope.equipos = response.data;
            $scope.lista[0].cantidad = $scope.equipos.length
        }, function errorCallback(response) {
            console.log(response.statusText);
        });
    }
    function getActividades() {
        $http({
            method: 'GET',
            url: '/actividad/buscar?pattern=' + $scope.pattern
        }).then(function successCallback(response) {
            $scope.actividades = response.data.map(function (actividad) {
                actividad.fechaInicioProgramado = new Date(actividad.fechaInicioProgramado);

                $scope.formulario.fechaInicioProgramado = new Date(actividad.fechaInicioProgramado);
                $scope.formulario.fechaFinProgramado = new Date(actividad.fechaFinProgramado);
                $scope.formulario.fechaInicioActividad = new Date(actividad.fechaInicioActividad);
                $scope.formulario.fechaFinActividad = new Date(actividad.fechaFinActividad);
                return actividad;
            });
            $scope.lista[1].cantidad = $scope.actividades.length
        }, function errorCallback(response) {
            console.log(response.statusText);
        });
    }
    function _actualizarDatos() {
        getMaquina();
        getFrente();
        getOperador();
    }
    function iniciar() {
        $('#contenidoCatalogos').hide();
        $('#contenidoReportes').hide();
        $('#operadores').hide();
        $("#frentes").hide();
        $("#maquinas").hide();
        $('#contenidoInicio').show();
        _actualizarDatos()

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
    function httpMetodo(method, url, data) {
        $http({
            method: method,
            url: url,
            data: $httpParamSerializerJQLike(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then($scope._correcto, $scope._error)
    }

    $scope.actualizar = function () {
        _actualizarDatos();
    }
    $scope.editar = function (tipo, formulario) {
        data = {};
        // if ($scope.formulario.id == -1 || $scope.formulario.id === undefined) {
        method = 'POST';
        url = '/equipo/actualizar/' + formulario.id;
        data.area_id = formulario.area.id;
        data.tipoGas_id = formulario.tipoGas.id;
        data.capacidadBTU_id = formulario.capacidadBTU.id;
        data.tipoFiltroDeshidratador_id = formulario.tipoFiltroDeshidratador.id;
        data.rangoPresionAlta_id = formulario.rangoPresionAlta.id;
        data.rangoPresionBaja_id = formulario.rangoPresionBaja.id;
        data.marca_id = formulario.marca.id;
        data.pH_id = formulario.pH.id;
        data.tipoEquipo_id = formulario.tipoEquipo.id;
        data.presostatoAlta_id = formulario.presostatoAlta.id;
        data.presostatoBaja_id = formulario.presostatoBaja.id;
        data.modelo = formulario.modelo;
        data.voltaje = formulario.voltaje;
        data.amperaje = formulario.amperaje;
        data.flipon = formulario.flipon;
        data.cableAlimentacion = formulario.cableAlimentacion;
        data.tranformador = formulario.tranformador;
        data.contactor = formulario.contactor;
        data.termostato = formulario.termostato;
        data.tarjetaElectronica = formulario.tarjetaElectronica;
        data.selector = formulario.selector;
        data.retardor = formulario.retardor;
        $http({
            method: method,
            url: url,
            data: $httpParamSerializerJQLike(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then($scope._correcto, $scope._error)

        // ELIMINAR
        if (!Array.isArray(formulario.eliminarMotores)) {
            formulario.eliminarMotores = [];
        }
        formulario.eliminarMotores.forEach(function (tipoMotor) {
            if (tipoMotor.id > 0) {
                data = {};
                method = 'DELETE';
                url = 'equipo/actualizar/' + formulario.id + '/tiposmotores';
                data.tipomotor_id = tipoMotor.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });
        if (!Array.isArray(formulario.eliminarCompresores)) {
            formulario.eliminarCompresores = [];
        }
        formulario.eliminarCompresores.forEach(function (tipoCompresor) {
            if (tipoCompresor.id > 0) {
                data = {};
                method = 'DELETE';
                url = 'equipo/actualizar/' + formulario.id + '/tiposcompresores';
                data.tipoCompresor_id = tipoCompresor.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });
        if (!Array.isArray(formulario.eliminarBaterias)) {
            formulario.eliminarBaterias = [];
        }
        formulario.eliminarBaterias.forEach(function (bateria) {
            if (bateria.id > 0) {
                data = {};
                method = 'DELETE';
                url = 'equipo/actualizar/' + formulario.id + '/baterias';
                data.bateria_id = bateria.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });
        if (!Array.isArray(formulario.eliminarTags)) {
            formulario.eliminarTags = [];
        }
        formulario.eliminarTags.forEach(function (tag) {
            if (tag.id > 0) {
                data = {};
                method = 'DELETE';
                url = 'equipo/actualizar/' + formulario.id + '/tags';
                data.tag_id = tag.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });

        // AGREGAR
        if (!Array.isArray(formulario.agregarMotores)) {
            formulario.agregarMotores = [];
        }
        formulario.agregarMotores.forEach(function (tipoMotor) {
            if (tipoMotor.id > 0) {
                data = {};
                method = 'POST';
                url = 'equipo/actualizar/' + formulario.id + '/tiposmotores';
                data.tipomotor_id = tipoMotor.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });
        if (!Array.isArray(formulario.agregarCompresores)) {
            formulario.agregarCompresores = [];
        }
        formulario.agregarCompresores.forEach(function (tipoCompresor) {
            if (tipoCompresor.id > 0) {
                data = {};
                method = 'POST';
                url = 'equipo/actualizar/' + formulario.id + '/tiposcompresores';
                data.tipoCompresor_id = tipoCompresor.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });
        if (!Array.isArray(formulario.agregarBaterias)) {
            formulario.agregarBaterias = [];
        }
        formulario.agregarBaterias.forEach(function (bateria) {
            if (bateria.id > 0) {
                data = {};
                method = 'POST';
                url = 'equipo/actualizar/' + formulario.id + '/baterias';
                data.bateria_id = bateria.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });
        if (!Array.isArray(formulario.agregarTags)) {
            formulario.agregarTags = [];
        }
        formulario.agregarTags.forEach(function (tag) {
            if (tag.id > 0) {
                data = {};
                method = 'POST';
                url = 'equipo/actualizar/' + formulario.id + '/tags';
                data.tag_id = tag.id;
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
            }
        });

    }
    $scope.ver = function (item, tipo, metodo) {
        switch (tipo) {
            case "contenido":
                switch (item.nombre) {
                    case "equipos":
                        $('#contenidoEquipos').show();
                        $('#contenidoInicio').hide();
                        $('#contenidoCatalogos').hide();
                        $('#contenidoReportes').hide();
                        $("#areas").hide();
                        $("#baterias").hide();
                        $("#capacidadBtu").hide();
                        $("#estado").hide()
                        $("#marca").hide()
                        $("#ph").hide()
                        $("#presostato").hide()
                        $("#rangoPresion").hide()
                        $("#tipoCompresor").hide()
                        $("#tipoEquipo").hide()
                        $("#tipoFiltroDeshidratador").hide()
                        $("#tipoGas").hide()
                        $("#tipoMotor").hide()
                        $("#tipoLimpieza").hide()
                        $("#tipoMantenimiento").hide()
                        $("#tipoNotificacion").hide()
                        $("#tag").hide()
                        $("#materiales").hide()
                        break;
                    case "catalogos":
                        $('#contenidoEquipos').hide();
                        $('#contenidoInicio').hide();
                        $('#contenidoCatalogos').show();
                        $('#contenidoActividades').hide();
                        $('#contenidoReportes').hide();
                        $('#contenidoEquipos').hide();
                        $("#maquinas").hide();
                        $("#frentes").hide();
                        break;
                    case "actividades":
                        $('#contenidoEquipos').hide();
                        $('#contenidoInicio').hide();
                        $('#contenidoCatalogos').hide();
                        $('#contenidoActividades').show();
                        $('#contenidoReportes').hide();
                        $('#contenidoEquipos').hide();
                        $("#areas").hide();
                        $("#baterias").hide();
                        $("#capacidadBtu").hide();
                        $("#estado").hide()
                        $("#marca").hide()
                        $("#ph").hide()
                        $("#presostato").hide()
                        $("#rangoPresion").hide()
                        $("#tipoCompresor").hide()
                        $("#tipoEquipo").hide()
                        $("#tipoFiltroDeshidratador").hide()
                        $("#tipoGas").hide()
                        $("#tipoMotor").hide()
                        $("#tipoLimpieza").hide()
                        $("#tipoMantenimiento").hide()
                        $("#tipoNotificacion").hide()
                        $("#tag").hide()
                        $("#materiales").hide()
                        break;
                    case "actividades":
                        $('#contenidoEquipos').hide();
                        $('#contenidoInicio').hide();
                        $('#contenidoCatalogos').hide();
                        $('#contenidoActividades').show();
                        $('#contenidoReportes').hide();
                        $('#contenidoEquipos').hide();
                        $("#areas").hide();
                        $("#baterias").hide();
                        $("#capacidadBtu").hide();
                        $("#estado").hide()
                        $("#marca").hide()
                        $("#ph").hide()
                        $("#presostato").hide()
                        $("#rangoPresion").hide()
                        $("#tipoCompresor").hide()
                        $("#tipoEquipo").hide()
                        $("#tipoFiltroDeshidratador").hide()
                        $("#tipoGas").hide()
                        $("#tipoMotor").hide()
                        $("#tipoLimpieza").hide()
                        $("#tipoMantenimiento").hide()
                        $("#tipoNotificacion").hide()
                        $("#tag").hide()
                        $("#materiales").hide()
                        break;
                    case "reportes":
                        $('#contenidoEquipos').hide();
                        $('#contenidoInicio').hide();
                        $('#contenidoCatalogos').hide();
                        $('#contenidoActividades').hide();
                        $('#contenidoReportes').show();
                        $('#contenidoEquipos').hide();
                        $("#areas").hide();
                        $("#baterias").hide();
                        $("#capacidadBtu").hide();
                        $("#estado").hide()
                        $("#marca").hide()
                        $("#ph").hide()
                        $("#presostato").hide()
                        $("#rangoPresion").hide()
                        $("#tipoCompresor").hide()
                        $("#tipoEquipo").hide()
                        $("#tipoFiltroDeshidratador").hide()
                        $("#tipoGas").hide()
                        $("#tipoMotor").hide()
                        $("#tipoLimpieza").hide()
                        $("#tipoMantenimiento").hide()
                        $("#tipoNotificacion").hide()
                        $("#tag").hide()
                        $("#materiales").hide()
                        break;
                    default:
                        break;
                }
                switch (item) {
                    case "inicio":
                        $('#contenidoInicio').show();
                        $('#contenidoCatalogos').hide();
                        $('#contenidoActividades').hide();
                        $('#contenidoReportes').hide();
                        $("#areas").hide();
                        $("#baterias").hide();
                        $("#capacidadBtu").hide();
                        $("#estado").hide()
                        $("#marca").hide()
                        $("#ph").hide()
                        $("#presostato").hide()
                        $("#rangoPresion").hide()
                        $("#tipoCompresor").hide()
                        $("#tipoEquipo").hide()
                        $("#tipoFiltroDeshidratador").hide()
                        $("#tipoGas").hide()
                        $("#tipoMotor").hide()
                        $("#tipoLimpieza").hide()
                        $("#tipoMantenimiento").hide()
                        $("#tipoNotificacion").hide()
                        $("#tag").hide()
                        $("#materiales").hide()
                        break;
                    case "configuracion":
                        $('#contenidoConfiguracion').modal('show');
                        break;
                    case "notificaciones":
                        $('#contenidoNotificacion').modal('show');
                        break;
                    case "modal-tipoMotor":
                        $('#modal-tipoMotor').modal('show');
                        break;
                    case "modal-tipoCompresor":
                        $('#modal-tipoCompresor').modal('show');
                        break;
                    case "modal-bateria":
                        $('#modal-bateria').modal('show');
                        break;
                    case "modal-tag":
                        $('#modal-tag').modal('show');
                        break;
                }

                break;
            case "maquina":
                switch (metodo) {
                    case "ver":
                        $("#maquinas").show();
                        $("#frentes").hide();
                        $("#operadores").hide();
                        
                        $scope.catalogoSeleccionado = 'maquina'
                        $('#itemFrente').removeClass('active');
                        $('#itemMaquina').addClass('active');
                        $('#itemOperador').removeClass('active');
                        break;
                    case "agregar":
                        $scope.metodo = metodo
                        if (item === 'agregar') {
                            $scope.formulario = {}
                        } else {
                            $scope.formulario = item
                        }
                        $("#tituloModal_editar_agregar_maquina").text("Agregar Maquina");
                        $('#editar_agregar_maquina').modal('show');
                        break;
                    case "editar":
                        $scope.formulario.maquina = item
                        $("#tituloModal_editar_agregar_maquina").text("Editar Maquina");
                        $('#editar_agregar_maquina').modal('show');
                        break;
                    default:
                        break;
                }
                break;
            case "frente":
                switch (metodo) {
                    case "ver":
                        $("#frentes").show();
                        $("#maquinas").hide();
                        $("#operadores").hide();
                        
                        $scope.catalogoSeleccionado = 'frente'
                        $('#itemMaquina').removeClass('active');
                        $('#itemFrente').addClass('active');
                        $('#itemOperador').removeClass('active');
                        break;
                    case "agregar":
                        $scope.metodo = metodo
                        if (item === 'agregar') {
                            $scope.formulario = {}
                        } else {
                            $scope.formulario = item
                        }
                        $("#tituloModal_editar_agregar_frente").text("Agregar Frente");
                        $('#editar_agregar_frente').modal('show');
                        break;
                    case "editar":
                        $scope.formulario.frente = item
                        $("#tituloModal_editar_agregar_frente").text("Editar Frente");
                        $('#editar_agregar_frente').modal('show');
                        break;
                    default:
                        break;
                }
                break;
            case "operador":
                switch (metodo) {
                    case "ver":
                        $("#operadores").show();
                        $("#frentes").hide();
                        $("#maquinas").hide();
                        
                        $scope.catalogoSeleccionado = 'operador'
                        $('#itemMaquina').removeClass('active');
                        $('#itemFrente').removeClass('active');
                        $('#itemOperador').addClass('active');
                        break;
                    case "agregar":
                        $scope.metodo = metodo
                        if (item === 'agregar') {
                            $scope.formulario = {}
                        } else {
                            $scope.formulario = item
                        }
                        $("#tituloModal_editar_agregar_operador").text("Agregar Operador");
                        $('#editar_agregar_operador').modal('show');
                        break;
                    case "editar":
                        $scope.formulario.operador = item
                        $("#tituloModal_editar_agregar_operador").text("Editar Operador");
                        $('#editar_agregar_operador').modal('show');
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
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
    $scope.guardar = function (tipo, formulario) {
        switch (tipo) {
            case "equipo":
                data = {};
                // if ($scope.formulario.id == -1 || $scope.formulario.id === undefined) {
                method = 'PUT';
                url = '/equipo/agregar';
                data.area_id = formulario.area.id;
                data.tipoGas_id = formulario.tipoGas.id;
                data.capacidadBTU_id = formulario.capacidadBTU.id;
                data.tipoFiltroDeshidratador_id = formulario.tipoFiltroDeshidratador.id;
                data.rangoPresionAlta_id = formulario.rangoPresionAlta.id;
                data.rangoPresionBaja_id = formulario.rangoPresionBaja.id;
                data.marca_id = formulario.marca.id;
                data.pH_id = formulario.pH.id;
                data.tipoEquipo_id = formulario.tipoEquipo.id;
                data.presostatoAlta_id = formulario.presostatoAlta.id;
                data.presostatoBaja_id = formulario.presostatoBaja.id;
                data.modelo = formulario.modelo;
                data.voltaje = formulario.voltaje;
                data.amperaje = formulario.amperaje;
                data.flipon = formulario.flipon;
                data.cableAlimentacion = formulario.cableAlimentacion;
                data.tranformador = formulario.tranformador;
                data.contactor = formulario.contactor;
                data.termostato = formulario.termostato;
                data.tarjetaElectronica = formulario.tarjetaElectronica;
                data.selector = formulario.selector;
                data.retardor = formulario.retardor;
                // } else {
                //     method = 'POST';
                //     url = '/equipo/rangopresion/' + $scope.formulario.rangoPresion.id;
                //     data.minimo = $scope.formulario.rangoPresion.minimo;
                //     data.maximo = $scope.formulario.rangoPresion.maximo;
                // }
                $http({
                    method: method,
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then($scope._correcto, $scope._error)
                break;
            case "frente":
                if ($scope.formulario.frente.id == -1 || $scope.formulario.frente.id === undefined) {
                    data = {};
                    method = 'PUT';
                    url = '/catalogo/' + tipo;
                    data.nombre = formulario.frente.nombre;
                    httpMetodo(method, url, data)
                } else {
                    data = {};
                    method = 'POST';
                    url = '/catalogo/' + tipo + '/' + formulario.frente.id;
                    data.nombre = formulario.frente.nombre;
                    httpMetodo(method, url, data)
                }
                break;
            case "maquina":
                if ($scope.formulario.maquina.id == -1 || $scope.formulario.maquina.id === undefined) {
                    data = {};
                    method = 'PUT';
                    url = '/catalogo/' + tipo;
                    data.nombre = formulario.maquina.nombre;
                    data.tipo = formulario.maquina.tipo;
                    httpMetodo(method, url, data)
                } else {
                    data = {};
                    method = 'POST';
                    url = '/catalogo/' + tipo + '/' + formulario.maquina.id;
                    data.nombre = formulario.maquina.nombre;
                    data.tipo = formulario.maquina.tipo;
                    httpMetodo(method, url, data)
                }
                break;
            case "operador":
                if ($scope.formulario.operador.id == -1 || $scope.formulario.operador.id === undefined) {
                    data = {};
                    method = 'PUT';
                    url = '/catalogo/' + tipo;
                    data.nombre = formulario.operador.nombre;
                    data.codigoEmpleado = formulario.operador.codigoEmpleado;
                    httpMetodo(method, url, data)
                } else {
                    data = {};
                    method = 'POST';
                    url = '/catalogo/' + tipo + '/' + formulario.operador.id;
                    data.nombre = formulario.operador.nombre;
                    data.codigoEmpleado = formulario.operador.codigoEmpleado;
                    httpMetodo(method, url, data)
                }
                break;
        
            default:
                break;
        }

    }
    $scope.eliminar = function (tipo, formulario) {
        switch (tipo) {
            case "area":
            case "material":
            case "bateria":
            case "capacidadbtu":
            case "estado":
            case "marca":
            case "ph":
            case "presostato":
            case "rangopresion":
            case "tipocompresor":
            case "tipoequipo":
            case "tipofiltrodeshidratador":
            case "tipogas":
            case "tipomotor":
            case "tipomantenimiento":
            case "tag":
                data = {};
                method = 'DELETE';
                url = '/equipo/' + tipo + '/' + formulario.id;
                httpMetodo(method, url, data);
                break;
            case "equipo":
                data = {};
                method = 'DELETE';
                url = 'equipo/eliminar/' + formulario.id;
                httpMetodo(method, url, data);
                break;
            default:
                break;
        }
    }

    $scope._error = function (response) {
        alert(response.data.message || response.statusText);
    }
    $scope._correcto = function (response) {
        $scope.pattern = '';
        _actualizarDatos();
    }

}]);
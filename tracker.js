var app = angular.module('myApp', []);
app.controller("appCtrl", function ($scope, $http, $q) {
    //Start of Admin Related

    $scope.sourceName = null;

    $scope.addSource = function () {
        const request = initializeDBConnection();

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction($scope.STORES.SOURCE_INFO, "readwrite");

            const store = transaction.objectStore($scope.STORES.SOURCE_INFO);

            var query = store.get(1);
            query.onsuccess = function () {
                var sourceInfoObj = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY);
                sourceInfoObj.sources.push($scope.sourceName);
                store.put(sourceInfoObj);
            };

            transaction.oncomplete = function () {
                db.close();
            };

            $scope.refreshSourceInfo();
        };

        request.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.deleteSource = function (sourceName) {
        const request = initializeDBConnection();

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction($scope.STORES.SOURCE_INFO, "readwrite");

            const store = transaction.objectStore($scope.STORES.SOURCE_INFO);

            var query = store.get(1);
            query.onsuccess = function () {
                if (query.result) {
                    var sourceInfoObj = query.result;
                    var updatedList = sourceInfoObj.sources.filter(function (obj) {
                        return (obj !== sourceName);
                    });
                    sourceInfoObj.sources = updatedList;
                    store.put(sourceInfoObj);
                }
            };

            transaction.oncomplete = function () {
                db.close();
            };

            $scope.refreshSourceInfo();
        };

        request.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.refreshSourceInfo = function () {
        const request = initializeDBConnection();
        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction($scope.STORES.SOURCE_INFO, "readwrite");

            const store = transaction.objectStore($scope.STORES.SOURCE_INFO);

            var query = store.get(1);
            query.onsuccess = function () {
                $scope.$apply(function () {
                    $scope.sourceInfo = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY);
                });
            };
            transaction.oncomplete = function () {
                db.close();
                $scope.fetchTransactions();
            };
        };
        request.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    $scope.selectSource = function (sourceName) {
        const request = initializeDBConnection();

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction($scope.STORES.SOURCE_INFO, "readwrite");

            const store = transaction.objectStore($scope.STORES.SOURCE_INFO);

            var query = store.get(1);
            query.onsuccess = function () {
                var sourceInfoObj = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY);;
                sourceInfoObj.selectedSource = sourceName;
                store.put(sourceInfoObj);
            };

            transaction.oncomplete = function () {
                db.close();
            };

            $scope.refreshSourceInfo();
        };

        request.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }
    //End of Admin Related


    $scope.fileName = "backup" + "-" + getFormattedDateTime(new Date());

    $scope.DEFAULT_OBJECTS = {"SUMMARY_KEY" : "summary-key", "MONTH_KEY" : "month-key", "SOURCE_INFO_KEY" : "source-info-key", "MAIN_KEY" : "main-key"};

    $scope.sourceInfo = getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY);
    $scope.initialAmount = 0;
    $scope.initialDate = new Date();
    $scope.summary = getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY);

    $scope.monthNames = [{ "full": "January", "short": "Jan", "index": 0 }, { "full": "February", "short": "Feb", "index": 1 },
        { "full": "March", "short": "Mar", "index": 2 }, { "full": "April", "short": "Apr", "index": 3 }, { "full": "May", "short": "May", "index": 4 },
        { "full": "June", "short": "Jun", "index": 5 }, { "full": "July", "short": "Jul", "index": 6 }, { "full": "August", "short": "Aug", "index": 7 },
        { "full": "September", "short": "Sep", "index": 8 }, { "full": "October", "short": "Oct", "index": 9 }, { "full": "November", "short": "Nov", "index": 10 },
        { "full": "December", "short": "Dec", "index": 11 }];
    $scope.years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

    $scope.expense = {};
    $scope.credit = {};
    $scope.monthBudget = getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY);

    $scope.filter = { "selectedYear": new Date().getFullYear(), "selectedMonth": new Date().getMonth() };


    $scope.DATABASE = "budget-tracker";
    $scope.STORES = {SOURCE_SUMMARY : "source-summary", MONTH_SUMMARY : "month-summary", SOURCE_INFO : "source-info"};


    //Backup and Restore related
    $scope.mainKey = "expense-tracker";

    function initializeDBConnection() {
        return indexedDB.open($scope.DATABASE, 1);
    }

    function setupDataBaseIfDoesNotExist() {

        return new Promise (function(resolve) {
            const indexedDB =
                window.indexedDB ||
                window.mozIndexedDB ||
                window.webkitIndexedDB ||
                window.msIndexedDB ||
                window.shimIndexedDB;

            if (!indexedDB) {
                alert("IndexedDB could not be found in this browser.");
            }

            const request = initializeDBConnection();

            request.onupgradeneeded = function () {
                const db = request.result;

                const sourceInfoStore = db.createObjectStore($scope.STORES.SOURCE_INFO, { keyPath: "id" });
                var sourceInfoValue = getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY);
                sourceInfoValue.id = getSourceInfoKey();
                sourceInfoStore.put(sourceInfoValue);

                const budgetStore = db.createObjectStore($scope.STORES.SOURCE_SUMMARY, { keyPath: "id" });
                var summaryValue = getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY);
                summaryValue.id = getSummaryKey();
                budgetStore.put(summaryValue);

                const monthStore = db.createObjectStore($scope.STORES.MONTH_SUMMARY, { keyPath: "id" });
                var monthKey = getMonthKey(new Date());
                var monthValue = getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY);
                monthValue.id = monthKey;
                monthStore.put(monthValue);

            };

            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction($scope.STORES.SOURCE_INFO, "readwrite");

                const store = transaction.objectStore($scope.STORES.SOURCE_INFO);

                var query = store.get(1);
                query.onsuccess = function () {
                    $scope.$apply(function () {
                        $scope.sourceInfo = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY);
                    });
                };

                transaction.oncomplete = function () {
                    db.close();
                    return resolve("success");
                };
            };

            request.onerror = function (event) {
                console.error("An error occurred with IndexedDB");
                console.error(event);
                return resolve("failure");
            };
        });
    }


    $scope.my_app_init = function () {
        setupDataBaseIfDoesNotExist().then(function (result) {
            if (result == "success") {
                $scope.fetchTransactions();
            }
        });
    };

    $scope.submitExpense = function () {
        var monthStore = $scope.STORES.MONTH_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(monthStore, "readwrite");

            const store = transaction.objectStore(monthStore);

            var transactiondate = $scope.expense.date;
            var monthKey = getMonthKey(transactiondate);

            var query = store.get(monthKey);
            query.onsuccess = function () {
                var monthValue = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY, transactiondate);
                if (monthValue.expenses.length == 0 && monthValue.credits.length == 0) {
                    monthValue.initialAmount = $scope.initialAmount;
                    monthValue.initialAmountDate = $scope.initialDate;
                }
                monthValue.maxId = monthValue.maxId + 1;
                $scope.expense.id = monthValue.maxId;
                monthValue.expenses.push($scope.expense);
                monthValue.totalExpenses = parseInt(monthValue.totalExpenses) + parseInt($scope.expense.amount);
                store.put(monthValue);

                updateSummaryObject(-Math.abs($scope.expense.amount));
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    $scope.deleteExpense = function (expense) {
        var monthStore = $scope.STORES.MONTH_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(monthStore, "readwrite");

            const store = transaction.objectStore(monthStore);

            var transactiondate = expense.date;
            var monthKey = getMonthKey(transactiondate);

            var query = store.get(monthKey);
            query.onsuccess = function () {
                if (query.result) {
                    var monthValue = query.result;
                    var updatedList = monthValue.expenses.filter(function (obj) {
                        return (obj.id != expense.id);
                    });
                    monthValue.expenses = updatedList;
                    monthValue.totalExpenses = parseInt(monthValue.totalExpenses) - parseInt(expense.amount);
                    store.put(monthValue);

                    updateSummaryObject(expense.amount);
                }
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.submitCredit = function () {
        var monthStore = $scope.STORES.MONTH_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(monthStore, "readwrite");

            const store = transaction.objectStore(monthStore);

            var transactiondate = $scope.credit.date;
            var monthKey = getMonthKey(transactiondate);

            var query = store.get(monthKey);
            query.onsuccess = function () {
                var monthValue = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY, transactiondate);
                if (monthValue.expenses.length == 0 && monthValue.credits.length == 0) {
                    monthValue.initialAmount = $scope.initialAmount;
                    monthValue.initialAmountDate = $scope.initialDate;
                }
                monthValue.maxId = monthValue.maxId + 1;
                $scope.credit.id = monthValue.maxId;
                monthValue.credits.push($scope.credit);
                monthValue.totalCredits = parseInt(monthValue.totalCredits) + parseInt($scope.credit.amount);
                store.put(monthValue);

                updateSummaryObject($scope.credit.amount)
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    $scope.deleteCredit = function (credit) {
        var monthStore = $scope.STORES.MONTH_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(monthStore, "readwrite");

            const store = transaction.objectStore(monthStore);

            var transactiondate = credit.date;
            var monthKey = getMonthKey(transactiondate);

            var query = store.get(monthKey);
            query.onsuccess = function () {
                if (query.result) {
                    var monthValue = query.result;
                    var updatedList = monthValue.credits.filter(function (obj) {
                        return (obj.id != credit.id);
                    });
                    monthValue.credits = updatedList;
                    monthValue.totalCredits = parseInt(monthValue.totalCredits) - parseInt(credit.amount);
                    store.put(monthValue);

                    updateSummaryObject(-Math.abs(credit.amount));
                }
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.setInitialAmount = function () {
        var summaryStore = $scope.STORES.SOURCE_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(summaryStore, "readwrite");

            const store = transaction.objectStore(summaryStore);

            var query = store.get(getSummaryKey());
            query.onsuccess = function () {
                var summaryObj = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY);
                summaryObj.initialAmount = $scope.initialAmount;
                summaryObj.initialAmountDate = $scope.initialDate;
                summaryObj.finalAmount = $scope.initialAmount;
                summaryObj.finalAmountDate = summaryObj.initialAmountDate;
                store.put(summaryObj);
            };

            transaction.oncomplete = function () {
                db.close();
            };

            $scope.fetchTransactions();
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    function updateSummaryObject(amount) {
        if (amount) {

            var summaryStore = $scope.STORES.SOURCE_SUMMARY;
            var connection = initializeDBConnection();
            connection.onsuccess = function () {
                const db = connection.result;
                const transaction = db.transaction(summaryStore, "readwrite");

                const store = transaction.objectStore(summaryStore);

                var query = store.get(getSummaryKey());
                query.onsuccess = function () {
                    var summaryObj = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY);
                    summaryObj.finalAmount = summaryObj.finalAmount > 0 ? parseInt(summaryObj.finalAmount) + parseInt(amount) : parseInt(amount) + parseInt(summaryObj.finalAmount);
                    summaryObj.finalAmountDate = new Date();
                    store.put(summaryObj);
                };

                transaction.oncomplete = function () {
                    db.close();
                    window.location.reload();
                };

                //$scope.fetchTransactions();
            };

            connection.onerror = function (event) {
                console.error("An error occurred with IndexedDB");
                console.error(event);
            };
        }
    }

    function getSyncLoop() {
        var syncLoop = function (iterations, process, exit) {
            var index = 0,
                done = false,
                shouldExit = false;
            var loop = {
                next: function () {
                    if (done) {
                        if (shouldExit && exit) {
                            return exit(); // Exit if we're done
                        }
                    }
                    // If we're not finished
                    if (index < iterations) {
                        index++; // Increment our index
                        process(loop); // Run our process, pass in the loop
                        // Otherwise we're done
                    } else {
                        done = true; // Make sure we say we're done
                        if (exit) exit(); // Call the callback on exit
                    }
                },
                iteration: function () {
                    return index - 1; // Return the loop number we're on
                },
                break: function (end) {
                    done = true; // End the loop
                    shouldExit = end; // Passing end as true means we still call the exit callback
                }
            };
            loop.next();
            return loop;
        }

        return syncLoop;
    }

    function exportStoreDataToJson(storeName) {
        return new Promise (function(resolve) {
            var connection = initializeDBConnection();
            connection.onsuccess = function () {
                const db = connection.result;
                const transaction = db.transaction(storeName, "readwrite");
                const store = transaction.objectStore(storeName);

                var query = store.getAll();
                query.onsuccess = function () {
                    return resolve(query.result);
                };

                transaction.oncomplete = function () {
                    db.close();
                };
            };
            connection.onerror = function (event) {
                console.error("An error occurred with IndexedDB");
                console.error(event);
                return resolve(null);
            };
        });
    }

    function exportDBDataToJson() {
        return new Promise (function(resolve) {
            var syncLoop = getSyncLoop();
            var exportObj = {};
            var storeKeys = Object.keys($scope.STORES);
            syncLoop(storeKeys.length, function (loop) {
                var index = loop.iteration();
                var storeName = $scope.STORES[storeKeys[index]];
                exportStoreDataToJson(storeName).then(function (result) {
                    exportObj[storeName] = result;
                    loop.next();
                });
            }, function () {
                return resolve(exportObj);
            });
        });
    }

    $scope.localStorageBackup = function () {
        exportDBDataToJson().then(function (exportObj) {
            var exportName = $scope.fileName;
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", exportName + ".json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }

    $scope.localStorageBackupToDrive = function () {
        exportDBDataToJson().then(function (exportObj) {
            $http.post("/backup", exportObj)
                .then(function(response) {
                    console.log(response);
                }, function(error) {
                    console.log(error);
                });
        });
    }

    $scope.localStorageRestore = function () {
        var t = document.createElement('div');
        var a = document.createElement('a');
        a.appendChild(document.createTextNode('X'));
        a.setAttribute('href', '#');

        a.style.position = 'absolute';
        a.style.top = '10px';
        a.style.right = '10px';
        a.style['text-decoration'] = 'none';
        a.style.color = '#fff';
        t.appendChild(a);
        a.onclick = function () {
            t.remove();
        };
        t.style.width = '50%';
        t.style.position = 'absolute';
        t.style.top = '25%';
        t.style.left = '25%';
        t.style['background-color'] = 'gray';
        t.style['text-align'] = 'center';
        t.style.padding = '50px';
        t.style.color = '#fff';
        t.style['z-index'] = 10000;

        var l = document.createElement('input');
        l.setAttribute('type', 'file');
        l.setAttribute('id', 'fileinput');
        l.onchange = function (e) {
            t.remove();
            var f = e.target.files[0];
            if (f) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var text = e.target.result;
                    var backup = JSON.parse(text);
                    restoreDataFromJson(backup);
                    alert('Imported ' + Object.keys(backup).length + ' items from backup.')
                    window.location.reload();
                };
                reader.readAsText(f);
            } else {
                alert('Failed to load file');
            }
        };
        var a = document.createElement('h3');
        a.appendChild(document.createTextNode('Select file with backup'));
        t.appendChild(a);
        t.appendChild(l);
        document.querySelector('body').appendChild(t);
    }

    $scope.driveRestore = function () {
        $http.get("/restore")
                .then(function(response) {
                    if (response.data != null && response.data != "") {
                        restoreDataFromJson(response.data);
                    }
                    console.log(response);
                }, function(error) {
                    console.log(error);
                });
    }

    function restoreDataFromJson(backup) {
        if (backup) {
            var connection = initializeDBConnection();
            connection.onsuccess = function () {
                const db = connection.result;

                angular.forEach(Object.keys(backup), function (storeName) {
                    const transaction = db.transaction(storeName, "readwrite");
                    const store = transaction.objectStore(storeName);
                    var storeValues = backup[storeName];
                    angular.forEach(storeValues, function (storeValue) {
                        store.put(storeValue);
                    })
                    transaction.oncomplete = function () {
                        db.close();
                    };
                });
            };
            connection.onerror = function (event) {
                console.error("An error occurred with IndexedDB");
                console.error(event);
            };
        }
    }
    
    $scope.deleteDataBase = function () {
        window.indexedDB.deleteDatabase($scope.DATABASE);
        window.location.reload();
    }

    $scope.formatDate = function (date) {
        var date = new Date(date);
        if (date) {
            var day = date.getDate();
            var month = $scope.monthNames[date.getMonth()].short;
            var year = date.getFullYear();
            return day + " " + month + " " + year;
        }
    }

    function frameMonthKey(month, year) {
        if (month && year && $scope.sourceInfo.selectedSource) {
            return (parseInt(month) + 1) + "-" + year + "-" + $scope.sourceInfo.selectedSource;
        }
    }

    $scope.fetchTransactions = function () {
        var monthStore = $scope.STORES.MONTH_SUMMARY;
        var summaryStore = $scope.STORES.SOURCE_SUMMARY;

        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const monthDb = connection.result;
            const monthTransaction = monthDb.transaction(monthStore, "readwrite");
            const monthSummaryStore = monthTransaction.objectStore(monthStore);
            var monthKey = frameMonthKey($scope.filter.selectedMonth, $scope.filter.selectedYear);
            var monthQuery = monthSummaryStore.get(monthKey);
            monthQuery.onsuccess = function () {
                $scope.$apply(function () {
                    $scope.monthBudget = monthQuery.result ? monthQuery.result : getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY);
                });
            };
            monthTransaction.oncomplete = function () {
                monthDb.close();
            };


            const summaryDb = connection.result;
            const summaryTransaction = summaryDb.transaction(summaryStore, "readwrite");
            const budgetSummaryStore = summaryTransaction.objectStore(summaryStore);
            var summaryQuery = budgetSummaryStore.get(getSummaryKey());
            summaryQuery.onsuccess = function () {
                $scope.$apply(function () {
                    $scope.summary = summaryQuery.result ? summaryQuery.result : getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY);;
                    $scope.initialAmount = $scope.summary.initialAmount;
                    $scope.initialDate = new Date($scope.summary.initialAmountDate.toString());
                });
            };
            summaryTransaction.oncomplete = function () {
                summaryDb.close();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    function getFormattedDateAndTime (date) {
        if (date) {
            var date = new Date(date);
            var day = date.getDate();
            var month = $scope.monthNames[date.getMonth()].short;
            var year = date.getFullYear();

            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            return day + " " + month + ", " + year + " " + hour + ":" + minutes + ":" + seconds;
        }
        return null;
    };

    $scope.getDisplayDate = function(date) {
        return getFormattedDateAndTime(date);
    }

    function getFormattedDateTime (date) {
        if (date) {
            var date = new Date(date);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            return day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
        }
        return null;
    };

    function getDefaultObject(type, date) {
        var date = !date ? new Date() : new Date(date);
        if (type === $scope.DEFAULT_OBJECTS.SUMMARY_KEY) {
            return {
                "initialAmount": 0,
                "initialAmountDate": date,
                "finalAmount": 0,
                "finalAmountDate": date,
                "id" : getSummaryKey()
            }
        } else if (type === $scope.DEFAULT_OBJECTS.MONTH_KEY) {
            return {
                initialAmount : 0,
                initialAmountDate : null,
                totalExpenses : 0,
                expenses : [],
                totalCredits : 0,
                credits : [],
                maxId : 0,
                id : getMonthKey(date)
            }
        } else if (type === $scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY) {
            return {
                id : getSourceInfoKey(),
                sources : ["default"],
                selectedSource : "default"
            };
        } else if (type === $scope.DEFAULT_OBJECTS.MAIN_KEY) {
            var obj = {};
            obj[$scope.STORES.SOURCE_INFO] = [getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY)];
            obj[$scope.STORES.SOURCE_SUMMARY] = [getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY)];
            obj[$scope.STORES.MONTH_SUMMARY] = [getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY)];
            return obj;
        }
    }

    function getMonthKey(date) {
        var date = new Date(date.toString());
        return frameMonthKey(date.getMonth(), date.getFullYear());
    }

    function getSummaryKey() {
        return "source-" + $scope.sourceInfo.selectedSource;
    }

    function getSourceInfoKey() {
        return 1;
    }
});
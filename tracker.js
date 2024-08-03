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
                $scope.fetchAnalytics();
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


    $scope.filterName = null;

    $scope.addFilter = function () {
        const request = initializeDBConnection();

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction($scope.STORES.FILTERS_INFO, "readwrite");

            const store = transaction.objectStore($scope.STORES.FILTERS_INFO);

            var query = store.get(1);
            query.onsuccess = function () {
                var filtersInfoObj = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.FILTERS_INFO_KEY);
                filtersInfoObj.filters.push($scope.filterName);
                store.put(filtersInfoObj);
            };

            transaction.oncomplete = function () {
                db.close();
            };

            $scope.refreshFiltersInfo();
        };

        request.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.deleteFilter = function (filterName) {
        const request = initializeDBConnection();

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction($scope.STORES.FILTERS_INFO, "readwrite");

            const store = transaction.objectStore($scope.STORES.FILTERS_INFO);

            var query = store.get(1);
            query.onsuccess = function () {
                if (query.result) {
                    var filtersInfoObj = query.result;
                    var updatedList = filtersInfoObj.filters.filter(function (obj) {
                        return (obj !== filterName);
                    });
                    filtersInfoObj.filters = updatedList;
                    store.put(filtersInfoObj);
                }
            };

            transaction.oncomplete = function () {
                db.close();
            };

            $scope.refreshFiltersInfo();
        };

        request.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.refreshFiltersInfo = function () {
        const request = initializeDBConnection();
        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction($scope.STORES.FILTERS_INFO, "readwrite");

            const store = transaction.objectStore($scope.STORES.FILTERS_INFO);

            var query = store.get(1);
            query.onsuccess = function () {
                $scope.$apply(function () {
                    $scope.filtersInfo = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.FILTERS_INFO_KEY);
                });
            };
            transaction.oncomplete = function () {
                db.close();
            };
        };
        request.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }


    //End of Admin Related


    $scope.fileName = "backup" + "-" + getFormattedDateTime(new Date());

    $scope.DEFAULT_OBJECTS = { "SUMMARY_KEY": "summary-key", "MONTH_KEY": "month-key", "SOURCE_INFO_KEY": "source-info-key", "FILTERS_INFO_KEY": "filters-info-key", "MAIN_KEY": "main-key", "LOANS_KEY" : "loans-key", "LEND_KEY" : "lend-key" };

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
    $scope.totalExpenses = { transactions: [], totalAmount: 0 };
    $scope.analyticsFilterKeyWords = [];

    $scope.loan = {};
    $scope.loanSummaryList = [];
    $scope.overallLoanSummary = {
        "totalLoan" : 0,
        "totalInterest" : 0,
        "totalPrincipal" : 0,
        "totalPending" : 0
    };

    $scope.lent = {};
    $scope.lendSummaryList = [];
    $scope.overallLendSummary = {
        "totalLent" : 0,
        "totalInterest" : 0,
        "totalPrincipal" : 0,
        "totalAmount" : 0
    };
    $scope.receivedLendPayments = [];

    $scope.interestCalculator = {
        "lastInterestPaid" : null,
        "endDate" : null,
        "loanRemaining" : null,
        "interestInRs" : null,
        "interestInperc" : null,
        "interestPerMonth" : 0,
        "interestPerDay" :  0,
        "totalDays" : "0 months 0 days",
        "totalInterest" : 0,
        "totalAmount" : 0
    }

    $scope.filter = { "selectedYear": new Date().getFullYear(), "selectedMonth": new Date().getMonth() , "selectedLoan" : null, "selectedDisplayLoan" : null, "selectedLend" : null, "selectedDisplayLend" : null};


    $scope.DATABASE = "budget-tracker";
    $scope.STORES = { SOURCE_SUMMARY: "source-summary", MONTH_SUMMARY: "month-summary", SOURCE_INFO: "source-info", FILTERS_INFO: "filters-info", LOAN_SUMMARY: "loan-summary", LEND_SUMMARY: "lend-summary" };


    //Backup and Restore related
    $scope.mainKey = "expense-tracker";

    function initializeDBConnection() {
        return indexedDB.open($scope.DATABASE, 1);
    }

    function setupDataBaseIfDoesNotExist() {

        return new Promise(function (resolve) {
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

                const filtersInfoStore = db.createObjectStore($scope.STORES.FILTERS_INFO, { keyPath: "id" });
                var filtersInfoValue = getDefaultObject($scope.DEFAULT_OBJECTS.FILTERS_INFO_KEY);
                filtersInfoValue.id = getFiltersInfoKey();
                filtersInfoStore.put(filtersInfoValue);

                const budgetStore = db.createObjectStore($scope.STORES.SOURCE_SUMMARY, { keyPath: "id" });
                var summaryValue = getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY);
                summaryValue.id = getSummaryKey();
                budgetStore.put(summaryValue);

                const monthStore = db.createObjectStore($scope.STORES.MONTH_SUMMARY, { keyPath: "id" });
                var monthKey = getMonthKey(new Date());
                var monthValue = getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY);
                monthValue.id = monthKey;
                monthStore.put(monthValue);

                const loanStore = db.createObjectStore($scope.STORES.LOAN_SUMMARY, { keyPath: "id" });
                var loanKey = getLoanKey() + "-test";
                var loanSummary = getDefaultObject($scope.DEFAULT_OBJECTS.LOANS_KEY);
                loanSummary.id = loanKey;
                loanStore.put(loanSummary);

                const lendStore = db.createObjectStore($scope.STORES.LEND_SUMMARY, { keyPath: "id" });
                var lendKey = getLentKey() + "-test";
                var lendSummary = getDefaultObject($scope.DEFAULT_OBJECTS.LEND_KEY);
                lendSummary.id = lendKey;
                lendStore.put(lendSummary);

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


                const filterInfoTransaction = db.transaction($scope.STORES.FILTERS_INFO, "readwrite");

                const filtersInfoStore = filterInfoTransaction.objectStore($scope.STORES.FILTERS_INFO);

                var filtersInfoQuery = filtersInfoStore.get(1);
                filtersInfoQuery.onsuccess = function () {
                    $scope.$apply(function () {
                        $scope.filtersInfo = filtersInfoQuery.result ? filtersInfoQuery.result : getDefaultObject($scope.DEFAULT_OBJECTS.FILTERS_INFO_KEY);
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
                $scope.fetchAnalytics();
                $scope.fetchLoans();
                $scope.fetchLendDetails();
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
        return new Promise(function (resolve) {
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
        return new Promise(function (resolve) {
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
                .then(function (response) {
                    console.log(response);
                }, function (error) {
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
            .then(function (response) {
                if (response.data != null && response.data != "") {
                    restoreDataFromJson(response.data);
                }
                console.log(response);
            }, function (error) {
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
        if (date) {
            var date = new Date(date);
            var day = date.getDate();
            var month = $scope.monthNames[date.getMonth()].short;
            var year = date.getFullYear();
            return day + " " + month + " " + year;
        }
    }

    function frameMonthKey(month, year) {
        if (month != undefined && year && $scope.sourceInfo.selectedSource) {
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

    function getFormattedDateAndTime(date) {
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

    $scope.getDisplayDate = function (date) {
        return getFormattedDateAndTime(date);
    }

    function getFormattedDateTime(date) {
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
                "id": getSummaryKey()
            }
        } else if (type === $scope.DEFAULT_OBJECTS.MONTH_KEY) {
            return {
                initialAmount: 0,
                initialAmountDate: null,
                totalExpenses: 0,
                expenses: [],
                totalCredits: 0,
                credits: [],
                maxId: 0,
                id: getMonthKey(date)
            }
        } else if (type === $scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY) {
            return {
                id: getSourceInfoKey(),
                sources: ["default"],
                selectedSource: "default"
            };
        } else if (type === $scope.DEFAULT_OBJECTS.FILTERS_INFO_KEY) {
            return {
                id: getFiltersInfoKey(),
                filters: []
            };
        } else if (type === $scope.DEFAULT_OBJECTS.MAIN_KEY) {
            var obj = {};
            obj[$scope.STORES.SOURCE_INFO] = [getDefaultObject($scope.DEFAULT_OBJECTS.SOURCE_INFO_KEY)];
            obj[$scope.STORES.SOURCE_SUMMARY] = [getDefaultObject($scope.DEFAULT_OBJECTS.SUMMARY_KEY)];
            obj[$scope.STORES.MONTH_SUMMARY] = [getDefaultObject($scope.DEFAULT_OBJECTS.MONTH_KEY)];
            return obj;
        } else if (type === $scope.DEFAULT_OBJECTS.LOANS_KEY) {
            return {
                "loanName" : null,
                "loanAmount": 0,
                "loanDate": null,
                "interestInRs": 0,
                "interestInperc": 0,
                "payments": [],
                "loanRemaining": 0,
                "maxId": 0,
                "id": getLoanKey()
              }
        } else if (type === $scope.DEFAULT_OBJECTS.LEND_KEY) {
            return {
                "loanName" : null,
                "loanAmount": 0,
                "loanDate": null,
                "interestInRs": 0,
                "interestInperc": 0,
                "payments": [],
                "loanRemaining": 0,
                "maxId": 0,
                "id": getLentKey()
              }
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

    function getFiltersInfoKey() {
        return 1;
    }

    $scope.fetchAnalytics = function () {
        var monthStore = $scope.STORES.MONTH_SUMMARY;

        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const monthDb = connection.result;
            const monthTransaction = monthDb.transaction(monthStore, "readwrite");
            const monthSummaryStore = monthTransaction.objectStore(monthStore);
            var monthQuery = monthSummaryStore.getAll();
            monthQuery.onsuccess = function () {
                $scope.$apply(function () {
                    console.log(monthQuery.result);
                    $scope.totalExpenses = { transactions: [], totalAmount: 0 };
                    var monthQueryResult = monthQuery.result ? monthQuery.result : [];
                    angular.forEach(monthQueryResult, function (monthWiseResult) {
                        if (monthWiseResult.id.indexOf($scope.sourceInfo.selectedSource) > -1) {
                            var monthSummaryObj = monthWiseResult;

                            var filteredResults = monthWiseResult.expenses.filter(function (expense) {
                                return isEligibleCandidate($scope.filtersInfo.filters, $scope.analyticsFilterKeyWords, expense.description);
                            });
                            //$scope.totalExpenses.transactions = $scope.totalExpenses.transactions.concat(filteredResults);
                            monthSummaryObj.expenses = filteredResults;

                            var monthSummaryTotalAmount = 0;
                            angular.forEach(filteredResults, function (transaction) {
                                monthSummaryTotalAmount = monthSummaryTotalAmount + parseInt(transaction.amount);
                                $scope.totalExpenses.totalAmount = parseInt(transaction.amount) + $scope.totalExpenses.totalAmount;
                            });
                            monthSummaryObj.totalExpenses = monthSummaryTotalAmount;

                            var idArr = monthWiseResult.id.split("-");
                            monthSummaryObj.displayHeader = $scope.monthNames[idArr[0] - 1].short + " " + idArr[1];
                            monthSummaryObj.sortKey = new Date("01-" + idArr[0] + "-" + idArr[1]);

                            $scope.totalExpenses.transactions.push(monthSummaryObj);
                        }
                    })
                });
            };
            monthTransaction.oncomplete = function () {
                monthDb.close();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    function isEligibleCandidate(mainFilter, subFilter, text) {
        var isEligible = false;
        if (mainFilter.length == 0 && subFilter.length == 0) {
            isEligible = true;
        } else if(mainFilter.length > 0 && subFilter.length == 0) {
            isEligible = mainFilter.indexOf(text) === -1 && !hasText(mainFilter, text);
        } else if(subFilter.length > 0 && mainFilter.length == 0) {
            isEligible = hasText(subFilter, text);
        } else {
            isEligible = mainFilter.indexOf(text) === -1 && !hasText(mainFilter, text) && hasText(subFilter, text);
        }
        return isEligible;
    }

    function hasText(list, text) {
        var hastextValue = false;
        if (text != null && list != null && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let value = list[i];
                hastextValue = text.toLowerCase().indexOf(value.toLowerCase()) > -1;
                if (hastextValue) {
                    break;
                }
            }
        }
        return hastextValue;
    }

    $scope.redirectToPage = function (page) {
        var baseUrl = window.location.origin;
        return baseUrl + "/" + page;
    }

    $scope.addAnalyticsFilterKeyWords = function (keyWord) {
        if (keyWord) {
            $scope.analyticsFilterKeyWords.push(keyWord);
            $scope.filterKeyWord = null;
            $scope.fetchAnalytics();
        }
    }

    $scope.deleteAnalyticsFilterKeyWords = function (keyWord) {
        if (keyWord) {
            var updatedList = $scope.analyticsFilterKeyWords.filter(function (obj) {
                return (obj != keyWord);
            });
            $scope.analyticsFilterKeyWords = updatedList;
            $scope.fetchAnalytics();
        }
    }

    $scope.printTransactions = function () {
        var divContents = $("#expenseTransactions").html();
        var printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write('<html><head><title></title>');
        printWindow.document.write(
            '<style>' +
            'table {' +
            'border-collapse: collapse;' +
            'border-spacing: 0;' +
            'width: 100%;' +
            'border: 1px solid #ddd;' +
            //'margin-left: 26%;' +
            //'width: 50% !important;' +
            '}' +

            'td {' +
            'text-align: left;' +
            'padding: 16px;' +
            '}' +

            'tr:nth-child(even) {' +
            'background-color: #f2f2f2;' +
            '}' +
            '</style>'

        );
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }






    //Loan Summary

    $scope.AddLoan = function () {
        var loanStore = $scope.STORES.LOAN_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanDate = $scope.loan.loanDate;
            var loanKey = getLoanKey();

            var query = store.get(loanKey);
            query.onsuccess = function () {
                var loanSummary = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.LOANS_KEY, loanDate);
                
                loanSummary.loanName = $scope.loan.loanName;
                loanSummary.loanAmount = parseFloat($scope.loan.loanAmount);
                loanSummary.loanDate = loanDate;
                loanSummary.interestInRs = $scope.loan.interestInRs ? parseFloat($scope.loan.interestInRs) : $scope.loan.interestInRs;
                loanSummary.interestInperc = $scope.loan.interestInperc ? parseFloat($scope.loan.interestInperc) : $scope.loan.interestInperc;
                loanSummary.loanRemaining = loanSummary.loanAmount;
                loanSummary.lastInterestPaid = loanDate;
                store.put(loanSummary);

            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    $scope.fetchLoans = function () {
        var loanStore = $scope.STORES.LOAN_SUMMARY;

        $scope.loanSummaryList = [];
        $scope.overallLoanSummary = {
            "totalLoan" : 0,
            "totalInterest" : 0,
            "totalPrincipal" : 0,
            "totalPending" : 0
        };

        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");
            const store = transaction.objectStore(loanStore);
            var loanSummaryQuery = store.getAll();
            loanSummaryQuery.onsuccess = function () {
                $scope.$apply(function () {
                    $scope.loanSummaryList = loanSummaryQuery.result ? loanSummaryQuery.result : [];
                    $scope.loanSummaryList = $scope.loanSummaryList.filter(function (loan) {
                        return loan.id.toString().indexOf("test") == -1;
                    });

                    $scope.loanSummaryList = $scope.loanSummaryList.filter(function (loanSummary) {
                        return isEligibleCandidateForSubFilters($scope.analyticsFilterKeyWords, loanSummary.loanName);
                    });

                    angular.forEach($scope.loanSummaryList, function (loanSummary) {
                        $scope.overallLoanSummary.totalLoan = $scope.overallLoanSummary.totalLoan + loanSummary.loanAmount;
                        $scope.overallLoanSummary.totalPrincipal = $scope.overallLoanSummary.totalPrincipal + loanSummary.loanRemaining;
                        $scope.overallLoanSummary.totalInterest = $scope.overallLoanSummary.totalInterest + $scope.calculateInterest(loanSummary);
                        $scope.overallLoanSummary.totalPending = $scope.overallLoanSummary.totalPending + loanSummary.loanRemaining + $scope.calculateInterest(loanSummary);
                    });
                });
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

    $scope.deleteLoan = function (loan) {
        var loanStore = $scope.STORES.LOAN_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanKey = loan.id;

            var query = store.get(loanKey);
            query.onsuccess = function () {
                if (query.result) {
                    store.delete(loanKey);
                }
            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.addLoanPayment = function (loanDetails, payment) {
        var loanStore = $scope.STORES.LOAN_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanKey = loanDetails.id;

            var query = store.get(loanKey);
            query.onsuccess = function () {
                if (query.result) {
                    var loanSummary = query.result;
                    var maxId = loanSummary.maxId + 1;
                    payment.id = maxId;
                    loanSummary.payments.push(payment);
                    loanSummary.maxId = maxId;
                    var interest = payment.interest ? parseFloat(payment.interest) : 0;
                    var principle = payment.principle ? parseFloat(payment.principle) : 0;
                    loanSummary.loanRemaining = parseFloat(loanSummary.loanRemaining) - principle;
                    if (principle == 0 && interest > 0) {
                        var interestPaidList = loanSummary.payments.filter(function (payment) {
                            return payment.interest != undefined && payment.interest > 0;
                        });
                        interestPaidList.sort(function(a,b){return new Date(b.date).getTime()-new Date(a.date).getTime()});
                        loanSummary.lastInterestPaid = interestPaidList.length > 0 ? interestPaidList[0].date : loanSummary.loanDate;;
                    }
                    store.put(loanSummary);
                }
            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };


    $scope.deleteLoanPayment = function (loanDetails, payment) {
        var loanStore = $scope.STORES.LOAN_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanKey = loanDetails.id;

            var query = store.get(loanKey);
            query.onsuccess = function () {
                if (query.result) {
                    var loanSummary = query.result;
                    var updatedList = loanSummary.payments.filter(function (obj) {
                        return (obj.id != payment.id);
                    });
                    loanSummary.payments = updatedList;
                    var interest = payment.interest ? payment.interest : 0;
                    var principle = payment.principle ? payment.principle : 0;
                    loanSummary.loanRemaining = parseInt(loanSummary.loanRemaining) + parseInt(principle);
                    if (interest > 0) {
                        var interestPaidList = loanSummary.payments.filter(function (payment) {
                            return payment.interest != undefined && payment.interest > 0;
                        });
                        interestPaidList.sort(function(a,b){return new Date(b.date).getTime()-new Date(a.date).getTime()});
                        loanSummary.lastInterestPaid = interestPaidList.length > 0 ? interestPaidList[0].date : loanSummary.loanDate;
                    }
                    store.put(loanSummary);
                }
            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    function getLoanKey() {
        return new Date().getTime()
    }

    $scope.addLoanFilterKeyWords = function (keyWord) {
        if (keyWord) {
            $scope.analyticsFilterKeyWords.push(keyWord);
            $scope.filterKeyWord = null;
            $scope.fetchLoanDetails();
        }
    }

    $scope.deleteLoanFilterKeyWords = function (keyWord) {
        if (keyWord) {
            var updatedList = $scope.analyticsFilterKeyWords.filter(function (obj) {
                return (obj != keyWord);
            });
            $scope.analyticsFilterKeyWords = updatedList;
            $scope.fetchLoanDetails();
        }
    }

    //End of Loan Methods


    // Start of Lent Methods

    $scope.AddLendDetails = function () {
        var loanStore = $scope.STORES.LEND_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanDate = $scope.lent.loanDate;
            var loanKey = getLentKey();

            var query = store.get(loanKey);
            query.onsuccess = function () {
                var loanSummary = query.result ? query.result : getDefaultObject($scope.DEFAULT_OBJECTS.LEND_KEY, loanDate);
                
                loanSummary.loanName = $scope.lent.loanName;
                loanSummary.loanAmount = parseFloat($scope.lent.loanAmount);
                loanSummary.loanDate = loanDate;
                loanSummary.interestInRs = $scope.lent.interestInRs ? parseFloat($scope.lent.interestInRs) : $scope.lent.interestInRs;
                loanSummary.interestInperc = $scope.lent.interestInperc ? parseFloat($scope.lent.interestInperc) : $scope.lent.interestInperc;
                loanSummary.loanRemaining = loanSummary.loanAmount;
                loanSummary.lastInterestPaid = loanDate;
                store.put(loanSummary);

            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    }

    $scope.fetchLendDetails = function () {
        var loanStore = $scope.STORES.LEND_SUMMARY;
        $scope.lendSummaryList = [];
        $scope.overallLendSummary = {
            "totalLent" : 0,
            "totalInterest" : 0,
            "totalPrincipal" : 0,
            "totalAmount" : 0,
            "receivedAmount" : 0
        };

        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");
            const store = transaction.objectStore(loanStore);
            var loanSummaryQuery = store.getAll();
            loanSummaryQuery.onsuccess = function () {
                $scope.$apply(function () {
                    $scope.lendSummaryList = loanSummaryQuery.result ? loanSummaryQuery.result : [];
                    $scope.lendSummaryList = $scope.lendSummaryList.filter(function (loan) {
                        return loan.id.toString().indexOf("test") == -1;
                    });

                    $scope.lendSummaryList = $scope.lendSummaryList.filter(function (lendSummary) {
                        return isEligibleCandidateForSubFilters($scope.analyticsFilterKeyWords, lendSummary.loanName);
                    });

                    angular.forEach($scope.lendSummaryList, function (lendSummary) {
                        $scope.overallLendSummary.totalLent = $scope.overallLendSummary.totalLent + lendSummary.loanAmount;
                        $scope.overallLendSummary.totalPrincipal = $scope.overallLendSummary.totalPrincipal + lendSummary.loanRemaining;
                        $scope.overallLendSummary.totalInterest = $scope.overallLendSummary.totalInterest + $scope.calculateInterestByMonthAndDate(lendSummary);
                        $scope.overallLendSummary.totalAmount = $scope.overallLendSummary.totalAmount + lendSummary.loanRemaining + $scope.calculateInterestByMonthAndDate(lendSummary);

                        $scope.overallLendSummary.receivedAmount = $scope.overallLendSummary.receivedAmount + fetchReceivedLendPayments(lendSummary);
                    });
                });
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

    function fetchReceivedLendPayments(lendSummary) {
        var totalReceivedAmount = 0;
        angular.forEach(lendSummary.payments, function (payment) {
            totalReceivedAmount = totalReceivedAmount + parseInt(payment.principle) + parseInt(payment.interest);
        });
        return totalReceivedAmount;
    }

    $scope.fetchReceivedLendPayments = function () {
        $scope.receivedLendPayments = [];
        angular.forEach($scope.lendSummaryList, function (lendSummary) {
            if (lendSummary.payments.length > 0) {
                var receivedPayment = {};
                receivedPayment.loanName = lendSummary.loanName;
                receivedPayment.paidAmount = fetchReceivedLendPayments(lendSummary);
                receivedPayment.remainingAmount = lendSummary.loanRemaining + $scope.calculateInterestByMonthAndDate(lendSummary);
                $scope.receivedLendPayments.push(receivedPayment);
            }
        });
    }

    $scope.deleteLendDetails = function (loan) {
        var loanStore = $scope.STORES.LEND_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanKey = loan.id;

            var query = store.get(loanKey);
            query.onsuccess = function () {
                if (query.result) {
                    store.delete(loanKey);
                }
            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    $scope.addLendPayment = function (loanDetails, payment) {
        var loanStore = $scope.STORES.LEND_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanKey = loanDetails.id;

            var query = store.get(loanKey);
            query.onsuccess = function () {
                if (query.result) {
                    var loanSummary = query.result;
                    var maxId = loanSummary.maxId + 1;
                    payment.id = maxId;
                    loanSummary.payments.push(payment);
                    loanSummary.maxId = maxId;
                    var interest = payment.interest ? parseFloat(payment.interest) : 0;
                    var principle = payment.principle ? parseFloat(payment.principle) : 0;
                    loanSummary.loanRemaining = parseFloat(loanSummary.loanRemaining) - principle;
                    if (principle == 0 && interest > 0) {
                        var interestPaidList = loanSummary.payments.filter(function (payment) {
                            return payment.interest != undefined && payment.interest > 0;
                        });
                        interestPaidList.sort(function(a,b){return new Date(b.date).getTime()-new Date(a.date).getTime()});
                        loanSummary.lastInterestPaid = interestPaidList.length > 0 ? interestPaidList[0].date : loanSummary.loanDate;
                    }
                    store.put(loanSummary);
                }
            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };


    $scope.deleteLendPayment = function (loanDetails, payment) {
        var loanStore = $scope.STORES.LEND_SUMMARY;
        var connection = initializeDBConnection();
        connection.onsuccess = function () {
            const db = connection.result;
            const transaction = db.transaction(loanStore, "readwrite");

            const store = transaction.objectStore(loanStore);

            var loanKey = loanDetails.id;

            var query = store.get(loanKey);
            query.onsuccess = function () {
                if (query.result) {
                    var loanSummary = query.result;
                    var updatedList = loanSummary.payments.filter(function (obj) {
                        return (obj.id != payment.id);
                    });
                    loanSummary.payments = updatedList;
                    var interest = payment.interest ? payment.interest : 0;
                    var principle = payment.principle ? payment.principle : 0;
                    loanSummary.loanRemaining = parseInt(loanSummary.loanRemaining) + parseInt(principle);
                    if (interest > 0) {
                        var interestPaidList = loanSummary.payments.filter(function (payment) {
                            return payment.interest != undefined && payment.interest > 0;
                        });
                        interestPaidList.sort(function(a,b){return new Date(b.date).getTime()-new Date(a.date).getTime()});
                        loanSummary.lastInterestPaid = interestPaidList.length > 0 ? interestPaidList[0].date : loanSummary.loanDate;
                    }
                    store.put(loanSummary);
                }
            };

            transaction.oncomplete = function () {
                db.close();
                window.location.reload();
            };
        };

        connection.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
        };
    };

    function getLentKey() {
        return new Date().getTime()
    }

    $scope.addLendFilterKeyWords = function (keyWord) {
        if (keyWord) {
            $scope.analyticsFilterKeyWords.push(keyWord);
            $scope.filterKeyWord = null;
            $scope.fetchLendDetails();
        }
    }

    $scope.deleteLendFilterKeyWords = function (keyWord) {
        if (keyWord) {
            var updatedList = $scope.analyticsFilterKeyWords.filter(function (obj) {
                return (obj != keyWord);
            });
            $scope.analyticsFilterKeyWords = updatedList;
            $scope.fetchLendDetails();
        }
    }

    //End Lent methods

    $scope.calculateInterest = function (loan) {
        var interestInRs = loan.interestInRs;

        var todayStart = new Date(new Date().setHours(0, 0, 0, 0))
        //var todayEnd = new Date(new Date().setHours(23, 59, 59, 999))

        var loanpaidStart = new Date(new Date(loan.lastInterestPaid).setHours(0, 0, 0, 0));

        var days = (todayStart.getTime() - loanpaidStart.getTime()) / (1000 * 60 * 60 * 24);
        days = Math.ceil(days);
        var interestPermonth = interestInRs * (loan.loanRemaining / 100);
        return Math.ceil((interestPermonth * days) / 30);
    }

    $scope.calculateDays = function (loan) {
        var todayStart = new Date(new Date().setHours(0, 0, 0, 0))
        var loanpaidStart = new Date(new Date(loan.lastInterestPaid).setHours(0, 0, 0, 0));
        var days = (todayStart.getTime() - loanpaidStart.getTime()) / (1000 * 60 * 60 * 24);
        return Math.ceil(days);
    }

    $scope.calculateInterestByMonthAndDate = function (loan) {
        var todayStart = new Date(new Date().setHours(0, 0, 0, 0))
        var yesterdayStart = getPreviousDayDate(todayStart);
        var monthsAndDays = getMonthAndDayDifferenceByLoan(loan, yesterdayStart);
    
        var totalInterestForMonths = $scope.getInterestPerMonth(loan) * monthsAndDays.months;
        var totalInterestForDays = $scope.getInterestPerDay(loan) * monthsAndDays.days
        return totalInterestForMonths + totalInterestForDays;
    }

    $scope.calculateInterestByMonthAndDateWithEndDate = function (loan, endDate) {
        var monthsAndDays = getMonthAndDayDifferenceByLoan(loan, endDate);
    
        var totalInterestForMonths = $scope.getInterestPerMonth(loan) * monthsAndDays.months;
        var totalInterestForDays = $scope.getInterestPerDay(loan) * monthsAndDays.days
        return totalInterestForMonths + totalInterestForDays;
    }

    $scope.getInterestEndDate = function () {
        var todayStart = new Date(new Date().setHours(0, 0, 0, 0))
        return $scope.formatDate(getPreviousDayDate(todayStart));
    }

    function getPreviousDayDate(currentDate) {
        // Create a new Date object for the current date
        const date = new Date(currentDate);
    
        // Subtract one day (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
        date.setDate(date.getDate() - 1);
    
        return date;
    }

    function getMonthAndDayDifferenceByLoan(loan, endDate) {
        var endDateStart = new Date(endDate.setHours(0, 0, 0, 0))

        var loanpaidStart = new Date(new Date(loan.lastInterestPaid).setHours(0, 0, 0, 0));
        return getMonthAndDayDifference(loanpaidStart, endDateStart);
    }
    
    function getMonthAndDayDifference(startDate, endDate) {
        // Convert the dates to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Calculate the difference in months
        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months -= start.getMonth();
        months += end.getMonth();
    
        // Adjust if the end date's day is less than the start date's day
        if (end.getDate() < start.getDate()) {
            months--;
        }
    
        // Calculate the remaining days
        const startOfNextMonth = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
        const days = Math.round((end - startOfNextMonth) / (1000 * 60 * 60 * 24));
    
        return { months, days };
    }

    $scope.getInterestPerMonth = function (loan) {
        var interestInRs = loan.interestInRs;
        return interestInRs * (loan.loanRemaining / 100);
    }

    $scope.getInterestPerDay = function (loan) {
        return $scope.getInterestPerMonth(loan) / 30;
    }

    $scope.getCalculatedDisplayMonthsAndDays = function (loan) {
        var todayStart = new Date(new Date().setHours(0, 0, 0, 0))
        var yesterdayStart = getPreviousDayDate(todayStart);
        var monthsAndDays = getMonthAndDayDifferenceByLoan(loan, yesterdayStart);
        return monthsAndDays.months + " months and " + monthsAndDays.days + " days"
    }

    $scope.getCalculatedDisplayMonthsAndDaysWithEndDate = function (loan, endDate) {
        var monthsAndDays = getMonthAndDayDifferenceByLoan(loan, endDate);
        return monthsAndDays.months + " months and " + monthsAndDays.days + " days"
    }

    $scope.calculateByInterestCalculatorForLoan = function (loan, endDate) {

        $scope.interestCalculator = {
            "lastInterestPaid" : loan.lastInterestPaid,
            "endDate" : endDate,
            "loanRemaining" : loan.loanRemaining,
            "interestInRs" : loan.interestInRs,
            "interestInperc" : loan.interestInperc,
            "interestPerMonth" : $scope.getInterestPerMonth(loan),
            "interestPerDay" :  $scope.getInterestPerDay(loan),
            "totalDays" : $scope.getCalculatedDisplayMonthsAndDaysWithEndDate(loan, endDate),
            "totalInterest" : $scope.calculateInterestByMonthAndDateWithEndDate(loan, endDate),
            "totalAmount" : 0
        }
        $scope.interestCalculator.totalAmount = parseInt($scope.interestCalculator.totalInterest) + parseInt($scope.interestCalculator.loanRemaining);
        $scope.interestCalculator.calculated = true;
        
    }

    $scope.resetInterestCalc = function () {
        $scope.interestCalculator = {
            "lastInterestPaid" : new Date(),
            "endDate" : new Date(),
            "loanRemaining" : null,
            "interestInRs" : null,
            "interestInperc" : null,
            "interestPerMonth" : 0,
            "interestPerDay" :  0,
            "totalDays" : "0 months 0 days",
            "totalInterest" : 0,
            "totalAmount" : 0
        }
    }

    function isEligibleCandidateForSubFilters(subFilter, text) {
        var isEligible = false;
        if (subFilter.length == 0) {
            isEligible = true;
        } else if(subFilter.length > 0) {
            isEligible = hasText(subFilter, text);
        }
        return isEligible;
    }
});
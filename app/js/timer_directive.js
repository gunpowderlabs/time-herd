export default function() {
  return {
    restrict: 'E',
    scope: {
      timer: '&'
    },
    controller: function($scope) {
      $scope.edits = {};

      $scope.edit = function() {
        $scope.edits.length = $scope.timer().length;
        $scope.underEdition = true;
      };

      $scope.closeEditForm = function() {
        $scope.underEdition = false;
      };

      $scope.updateTimer = function() {
        $scope.timer().length = $scope.edits.length;
        $scope.underEdition = false;
        $scope.timer().start();
      };
    },
    templateUrl: 'templates/timer_directive.html'
  }
}

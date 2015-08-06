export default function() {
  return {
    restrict: 'E',
    scope: {
      timer: '&'
    },
    controller: function($scope, $filter) {
      $scope.edits = {};

      $scope.edit = function() {
        $scope.edits.length = $filter('duration')($scope.timer().length);
        $scope.underEdition = true;
      };

      $scope.closeEditForm = function() {
        $scope.underEdition = false;
      };

      $scope.updateTimer = function() {
        const length = $scope.edits.length
          .split(":")
          .map(Number)
          .reduce((a, b) => a * 60 + b);
        $scope.timer().length = length;
        $scope.underEdition = false;
        $scope.timer().start();
      };
    },
    templateUrl: 'templates/timer_directive.html'
  }
}

class Enum::TimesheetEndTimeRoundType < Enum::Base
  ROUND_UP = self.new(1, :"切り上げる")
  ROUND_DOWN = self.new(2, :"切り下げる")
end

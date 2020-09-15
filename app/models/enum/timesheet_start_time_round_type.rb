class Enum::TimesheetStartTimeRoundType < Enum::Base
  ROUND_DOWN = self.new(1, :"切り下げる")
  ROUND_UP = self.new(2, :"切り上げる")
end

class Enum::TimesheetType < Enum::Base
  USE = self.new(1, :"使う")
  NOT_USE = self.new(2, :"使わない")
end

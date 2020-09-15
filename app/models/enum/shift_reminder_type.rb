class Enum::ShiftReminderType < Enum::Base
  USE = self.new(1, :"リマインドする")
  NOT_USE = self.new(2, :"リマインドしない")
end

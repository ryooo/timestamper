class Enum::NotificationType < Enum::Base
  NOTHING = self.new(1, :"通知しない")
  NOTIFY = self.new(2, :"通知する")
end

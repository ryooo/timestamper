class Enum::ForumType < Enum::Base
  EMPLOYEE_POSTABLE = self.new(1, :"全員投稿可")
  LOCATION_MANAGER_POSTABLE = self.new(2, :"マネージャーのみ投稿可")
  ORGANIZATION_MANAGER_POSTABLE = self.new(3, :"組織マネージャーのみ投稿可")
  NOT_USE = self.new(4, :"使わない")
end

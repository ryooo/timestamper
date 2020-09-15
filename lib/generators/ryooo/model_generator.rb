require 'rails/generators'

module Ryooo
  class ModelGenerator < ::Rails::Generators::Base
    source_root File.expand_path('../templates', __FILE__)

    def by_table_definitions
      dataset = Rails.application.class.parent.to_s.underscore
      say "データセット: #{dataset}", :green

      ActiveRecord::Base.connection.tables.each do |table_name|
        template "active_record.rb.erb", "app/models/#{table_name.singularize}.rb", context: instance_eval("binding")
        ActiveRecord::Base.connection.columns(table_name).each do |column|
          if column.name.end_with?("_type_id")
            model_name = column.name.gsub('_id', '')
            template "enum.rb.erb", "app/models/enum/#{model_name}.rb", context: instance_eval("binding")
          end
        end
      end
    end
  end
end

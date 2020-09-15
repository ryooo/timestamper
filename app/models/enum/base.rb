module Enum
  class Base
    class_attribute :cache
    attr_accessor :id, :name

    def initialize(id, name, *args)
      @id, @name = id, name
      self.class.cache ||= {}
      if self.class.cache[@id].present?
        raise "Same ID Error #{self.class.name} #{@id}"
      end
      self.class.cache[@id] = self
      @options = args.extract_options!
    end

    def self.get_enum(id)
      return self.cache[id]
    end

    def self.get_enum_ids
      return self.cache.keys
    end

    def self.ids
      return self.cache.keys
    end

    def self.all
      return self.cache.values
    end

    def select_tag_data_options
      return {}
    end

    def ==(other)
      return false if other.nil?
      return self.id == other.id
    end

    def to_hash
      return {
        :id => self.id,
        :name => self.name,
      }
    end

    def self.to_select_option
      Hash[self.all.map{|e| [e.name, e.id] }]
    end
  end
end

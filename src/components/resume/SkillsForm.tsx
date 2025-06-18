import React, { useState, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Loader2 } from 'lucide-react';
import { showLog } from '@/commonFunctions/Functions';

interface SkillsFormProps {
  storeSkill: (payload: { skill_name: string; skill_category_id: string; proficiency_level: string }) => void;
  deleteSkill: (skillId: string) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ storeSkill, deleteSkill }) => {
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills"
  });

  const isSkillLoading = useSelector((state) => state.readSkillReducer.isSkillLoading);
  const isSkillStoring = useSelector((state) => state.storeSkillReducer.isSkillStoring);
  const isSkillDeleting = useSelector((state) => state.deleteSkillReducer.isSkillDeleting);
  const skillCategories = useSelector((state) => state.readSkillCategoryReducer.skillCategoryMainData || []);
  const proficiencyLevelsObj = useSelector((state) => state.readProficiencyLevelReducer.proficiencyLevelMainData || {});
  const isSkillCategoryLoading = useSelector((state) => state.readSkillCategoryReducer.isSkillCategoryLoading);
  const isProficiencyLevelLoading = useSelector((state) => state.readProficiencyLevelReducer.isProficiencyLevelLoading);

  showLog(`Skill Categories: `,useSelector((state) => state.readSkillCategoryReducer.skillCategoryMainData));

  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Convert proficiency levels object to array for dropdown
  const proficiencyLevels = Object.entries(proficiencyLevelsObj).map(([id, name]) => ({
    id,
    name,
  }));

  // Set default values when data is loaded
  useEffect(() => {
    if (skillCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(skillCategories[0].name);
    }
    if (proficiencyLevels.length > 0 && !selectedLevel) {
      // Set default to Intermediate (id: 2) if available
      const intermediate = proficiencyLevels.find(level => level.id === '2');
      setSelectedLevel(intermediate ? intermediate.name : proficiencyLevels[0].name);
    }
  }, [skillCategories, proficiencyLevels, selectedCategory, selectedLevel]);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const category = skillCategories.find(cat => cat.name === selectedCategory);
      const level = proficiencyLevels.find(lvl => lvl.name === selectedLevel);
      if (category && level) {
        storeSkill({
          skill_name: newSkill.trim(),
          skill_category_id: String(category.id),
          proficiency_level: String(level.name),
        });
        append({
          name: newSkill.trim(),
          level: selectedLevel,
          category: selectedCategory,
        });
        setNewSkill('');
      }
    }
  };

  const handleRemoveSkill = (index: number) => {
    const skill = fields[index];
    if (skill.skillId) {
      deleteSkill(skill.skillId);
    }
    remove(index);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  if (isSkillCategoryLoading || isProficiencyLevelLoading) {
    return <Loader />;
  }

  if (!skillCategories.length || !proficiencyLevels.length) {
    return (
      <div className="text-center text-muted-foreground">
        Unable to load skill categories or proficiency levels. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSkillLoading || isSkillStoring || isSkillDeleting}
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={isSkillLoading || isSkillStoring || isSkillDeleting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem>
              <FormLabel>Proficiency Level</FormLabel>
              <Select
                value={selectedLevel}
                onValueChange={setSelectedLevel}
                disabled={isSkillLoading || isSkillStoring || isSkillDeleting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level.id} value={level.name}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleAddSkill}
                className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                disabled={isSkillLoading || isSkillStoring || isSkillDeleting}
              >
                {isSkillStoring ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Skill...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {skillCategories.map((category) => {
          const categorySkills = fields.filter(
            (field) => field.category === category.name
          );

          if (categorySkills.length === 0) return null;

          return (
            <div key={category.id}>
              <h3 className="text-sm font-medium mb-2">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill, index) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {skill.name}
                    {skill.level && (
                      <span className="text-xs text-muted-foreground">
                        • {skill.level}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveSkill(index)}
                      disabled={isSkillLoading || isSkillStoring || isSkillDeleting}
                    >
                      {isSkillDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsForm;
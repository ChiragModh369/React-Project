import React, { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

interface ExperienceFormProps {
  updateExperiences: (experiences: any[]) => void;
  deleteExperiences: (experienceIds: string[]) => void;
  isInitialMount: React.MutableRefObject<boolean>;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  updateExperiences,
  deleteExperiences,
  isInitialMount,
}) => {
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const isExperienceUpdating = useSelector(
    (state: any) => state.updateExperienceReducer.isExperienceUpdating
  );

  const isExperienceDeleting = useSelector(
    (state: any) => state.deleteExperienceReducer.isExperienceDeleting
  );

  const handleDeleteExperience = useCallback(
    (index: number) => {
      const experience = getValues(`experiences.${index}`);
      if (experience.experienceId) {
        // If the experience has an ID, call the delete API
        deleteExperiences([experience.experienceId]);
      }
      // Remove from form regardless
      remove(index);
    },
    [getValues, deleteExperiences, remove]
  );

  const handleUpdateExperiences = useCallback(() => {
    const experiences = getValues("experiences") || [];
    if (!experiences || !Array.isArray(experiences)) return;

    const experiencesToSave = experiences.filter(
      (exp: any) =>
        exp.experienceId ||
        exp.company?.trim() ||
        exp.position?.trim() ||
        exp.startDate?.trim() ||
        exp.endDate?.trim() ||
        exp.description?.trim()
    );

    if (experiencesToSave.length === 0) return;

    const payload = experiencesToSave.map((exp: any) => ({
      ...(exp.experienceId && { experience_id: exp.experienceId }),
      company: exp.company || "",
      position: exp.position || "",
      start_date: exp.startDate || "",
      end_date: exp.endDate || "",
      description: exp.description || "",
    }));

    updateExperiences(payload);
  }, [getValues, updateExperiences]);

  const addExperience = () => {
    append({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => handleDeleteExperience(index)}
              // onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`experiences.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`experiences.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`experiences.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan 2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`experiences.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Present or Jan 2021" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`experiences.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addExperience}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
        <Button
          type="button"
          className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
          onClick={handleUpdateExperiences}
          disabled={isExperienceUpdating}
        >
          {isExperienceUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Experiences
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExperienceForm;

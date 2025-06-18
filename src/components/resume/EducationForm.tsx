import React, { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

interface EducationFormProps {
  updateEducations: (educations: any[]) => void;
  deleteEducations: (educationId: string) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ updateEducations, deleteEducations }) => {
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  });

  const isEducationLoading = useSelector(
    (state: any) => state.readEducationReducer.isEducationLoading
  );
  const isEducationUpdating = useSelector(
    (state: any) => state.updateEducationReducer.isEducationUpdating
  );
  const isEducationDeleting = useSelector(
    (state: any) => state.deleteEducationReducer.isEducationDeleting
  );

  const handleDeleteEducation = useCallback((index: number) => {
    const education = getValues(`education.${index}`);
    if (education.educationId) {
      deleteEducations(education.educationId);
    }
    remove(index);
  }, [getValues, deleteEducations, remove]);

  const handleUpdateEducations = useCallback(() => {
    const educations = getValues("education") || [];
    if (!educations || !Array.isArray(educations)) return;

    const educationsToSave = educations.filter(
      (edu: any) =>
        edu.educationId ||
        edu.institution?.trim() ||
        edu.degree?.trim() ||
        edu.year?.trim() ||
        edu.description?.trim()
    );

    if (educationsToSave.length === 0) return;

    const payload = educationsToSave.map((edu: any) => ({
      ...(edu.educationId && { education_id: edu.educationId }),
      institution: edu.institution || "",
      degree: edu.degree || "",
      year: edu.year || "",
      additional_information: edu.description || "",
    }));

    updateEducations(payload);
  }, [getValues, updateEducations]);

  const addEducation = () => {
    append({
      educationId: undefined,
      institution: '',
      degree: '',
      year: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Education {index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => handleDeleteEducation(index)}
              disabled={isEducationLoading || isEducationUpdating || isEducationDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name={`education.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University or Institution Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Bachelor's, Master's, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`education.${index}.year`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2019-2022" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`education.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Relevant coursework, achievements, etc."
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
          onClick={addEducation}
          disabled={isEducationLoading || isEducationUpdating}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
        <Button
          type="button"
          className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
          onClick={handleUpdateEducations}
          disabled={isEducationLoading || isEducationUpdating}
        >
          {isEducationUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Educations
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EducationForm;
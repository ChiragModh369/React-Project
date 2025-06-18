import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showLog } from '@/commonFunctions/Functions';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const PersonalInfoForm = ({ updateProfile }) => {
  const { control, setValue, getValues } = useFormContext();

  const handleFieldChange = (fieldName, value) => {
    showLog(`Field changed: ${fieldName}`, value);
    setValue(`personalInfo.${fieldName}`, value, { shouldDirty: true });
    const updatedPersonalInfo = getValues('personalInfo');
    showLog('Current form state', updatedPersonalInfo);
    // Call updateProfile immediately with the updated personal info
    updateProfile(updatedPersonalInfo);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="personalInfo.fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="John Doe"
                {...field}
                onChange={(e) => {
                  handleFieldChange('fullName', e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="personalInfo.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Senior Cybersecurity Engineer"
                {...field}
                onChange={(e) => {
                  handleFieldChange('title', e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="personalInfo.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  type="email"
                  {...field}
                  onChange={(e) => {
                    handleFieldChange('email', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalInfo.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="+1 (555) 123-4567"
                  {...field}
                  onChange={(e) => {
                    handleFieldChange('phone', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="personalInfo.location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input
                placeholder="New York, NY"
                {...field}
                onChange={(e) => {
                  handleFieldChange('location', e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="personalInfo.summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Summary</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Experienced cybersecurity professional with expertise in..."
                className="min-h-[100px]"
                {...field}
                onChange={(e) => {
                  handleFieldChange('summary', e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-4">
        <Label>Social Links</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="personalInfo.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/johndoe"
                    {...field}
                    onChange={(e) => {
                      handleFieldChange('linkedin', e.target.value);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="personalInfo.github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/johndoe"
                    {...field}
                    onChange={(e) => {
                      handleFieldChange('github', e.target.value);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="personalInfo.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://johndoe.com"
                  {...field}
                  onChange={(e) => {
                    handleFieldChange('website', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
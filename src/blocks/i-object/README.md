# mjj-why/i-object

This block is a proof of concept which uses register_rest_field() to add and update the "mjj_objections" field on posts and pages. 

It should:
- save / update the postmeta with post_id = parent post ID every time the post is saved
- also save the postmeta with the post_id = draft ID every time a revision is saved (ie a new post with post_type drafts and auto-drafts is created)

Currently the canonical source of truth is postmeta, although this approach will clutter up the postmeta table. A better approach might be to make the canonical source of truth as the attributes registered in registerBlockType. It would certainly make handling revisions easier.

Saving to postmeta is handled by the MJJIObjectSave component.
